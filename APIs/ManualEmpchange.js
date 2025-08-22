const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const path = require("path");
const { stringify } = require("querystring");
const router = express.Router();

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.get("/getRandomizeEmpDetails",(req,res)=>{
    const {ET , block , code} = req.query;
    console.log("Incoming params:", ET, block, code);  
    const query =`
    SELECT 
        t1.ElectionName,
        t1.ElectionBlock,
        t1.PS,
        CASE 
            WHEN t2.P0 = ? THEN 'P0'
            WHEN t2.P1 = ? THEN 'P1'
            WHEN t2.P2 = ? THEN 'P2'
            WHEN t2.P3 = ? THEN 'P3'
            ELSE NULL
        END AS MatchedColumn
    FROM randomisation3 t1
    JOIN randomisation2 t2 ON t1.R2id = t2.id
    WHERE t1.ElectionName = ?
    AND t1.ElectionBlock = ?
    AND ? IN (t2.P0, t2.P1, t2.P2, t2.P3);
    `;

    connection.query(query,[ code, code, code, code, ET, block, code ],(err,result)=>{
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.status(200).json({
            success : true,
            result 
        });
    });
});


router.get("/getNonSelectedEmp",async (req,res)=>{
    const {ET , block , p } = req.query;
    try {

        if (!ET || !block || !p) {
        return res.status(400).json({
            success: false,
            message: "Missing required query parameters: ET, block, p",
        });
    }
        const posts = await getallposts(ET, p);
        const empcodes = await getallemps(ET , block , posts);
        const checkedcodes = await checkuniquecodes(ET , block , empcodes);

        if(checkedcodes.length === 0){
            res.status(204).json({
                success : false,
                message : "According to condition No data Found"
            });
        }else{
            res.status(200).json({
                success : true,
                codes : checkedcodes
            });
        }
    } catch (error) {
        console.error("Error in /getNonSelectedEmp:", error);
            res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            });
    }
});

const getallposts =  (et ,p) =>{
    return new Promise((resolve , reject)=>{
        const pi = p.toLowerCase();
        connection.query(`select ${p} from pollingofficers${pi} where ElectionType = ?`,[et],(err,result)=>{
            if (err) return reject(err);
            const list = result.map(val => val[p]);
            resolve(list);
        });
    });
}

const getallemps = (ET , block , posts) =>{
    return new Promise((resolve , reject)=>{
            connection.query(`SELECT Employee_code FROM employee_data 
                 WHERE Designation IN (?) 
                 AND varified = 'Varified'
                 AND Assembly_Constituency_of_Residence != ?
                 AND Assembly_Constituency_of_Workplace != ?
                 AND Gender = 'male' AND Differently_abled = 'No' `,[posts , block , block],(err,result)=>{
                    if (err) return reject(err);

                    if(result.length === 0){
                        connection.query(`SELECT Employee_code FROM employee_data 
                                        WHERE 
                                        varified = 'Varified'
                                        AND Assembly_Constituency_of_Residence != ?
                                        AND Assembly_Constituency_of_Workplace != ?
                                        AND Gender = 'male' AND Differently_abled = 'No' `,[block , block],(err2,result2)=>{
                                        if(err2) return reject(err2);

                                        if(result.length === 0){
                                            return reject(new Error("no employee found"));
                                        }
                                        const data2 = result2.map(val => val.Employee_code);
                                        resolve(data2);
                                        return;
                        });
                    }

                const data1 = result.map(val => val.Employee_code);
                resolve(data1);
            });

    });
}

const checkuniquecodes = (et, block, codes) => {
    return new Promise((resolve, reject) => {
        // Ensure codes is always an array
        let empCodes = Array.isArray(codes) ? codes : [codes];

        if (empCodes.length === 0) {
            return resolve([]); // nothing to check
        }

        // Step 1: Get already used codes from randomisation2
        connection.query(
            `SELECT P0, P1, P2, P3 
             FROM randomisation2 
             WHERE ElectionName = ? AND ElectionBlock = ?`,
            [et, block],
            (err, rows) => {
                if (err) return reject(err);

                const usedCodes = new Set();
                rows.forEach(row => {
                    if (row.P0) usedCodes.add(String(row.P0));
                    if (row.P1) usedCodes.add(String(row.P1));
                    if (row.P2) usedCodes.add(String(row.P2));
                    if (row.P3) usedCodes.add(String(row.P3));
                });

                // Filter out codes already in randomisation2
                let filtered = empCodes.filter(code => !usedCodes.has(String(code)));

                if (filtered.length === 0) {
                    return resolve([]); // all were duplicates
                }

                // Step 2: Check against randomisation5percentextra1
                connection.query(
                    `SELECT Extra5Percent 
                     FROM randomisation5percentextra1 
                     WHERE ElectionName = ? AND ElectionBlock = ?`,
                    [et, block],
                    (err2, rows2) => {
                        if (err2) return reject(err2);

                        const extraCodes = new Set();
                        rows2.forEach(row => {
                            if (row.Extra5Percent) {
                                extraCodes.add(String(row.Extra5Percent));
                            }
                        });

                        // Filter again
                        const finalFiltered = filtered.filter(code => !extraCodes.has(String(code)));

                        resolve(finalFiltered);
                    }
                );
            }
        );
    });
};


router.post("/InsertManualEmpCode", async (req, res) => {
  const { ET, Block, designation, password, id, prevcode, code } = req.body;

  try {
    const passwordmatching = await matchpassword(password, id);

    if (!passwordmatching) {
      return res.status(401).json({ success: false, message: "Invalid password or ID" });
    }

    // Run update query
    connection.query(
      `UPDATE randomisation2 
       SET ${designation} = ? 
       WHERE ElectionName = ?  
         AND ElectionBlock = ?  
         AND ${designation} = ?`,
      [code, ET, Block, prevcode],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error", error: err.message });
        }

        if (result.affectedRows === 0) {
          // No rows updated → probably wrong prevcode or no match
          return res
            .status(404)
            .json({ success: false, message: "No matching record found to update" });
        }

        // Success
        return res.json({ success: true, code , message: "Employee code updated successfully" });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal server error" });
  }
});

// Utility function
const matchpassword = (password, id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT adminPassword FROM adminsignup WHERE adminId = ?`,
      [id],
      async (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) {
          // user not found
          return resolve(false);
        }

        try {
          const isMatch = await bcrypt.compare(password, result[0].adminPassword);
          if (!isMatch) {
            return resolve(false);
          }
          resolve(true);
        } catch (compareErr) {
          reject(compareErr);
        }
      }
    );
  });
};



module.exports = router;