const express = require("express");
const sql = require("mysql2");
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.get(`/checkrandomise2data`, async (req,res)=>{
    const {ET} = req.query;
    console.log(ET);
        try {
            const blockdata = ((ET)=>{
                return new Promise((resolve , reject)=>{
                    const url = `SELECT ElectionBlocks FROM electionbodydata WHERE ElectionName = ?;`;
                    connection.query(url,[ET],(err,result)=>{
                        if(err) return reject(err);
        
                        if(result.length === 0){
                            return reject(new Error("Block data is not available for the associated election"));
    
                        }
        
                        const blocks = result.map(val => val.ElectionBlocks);
                        resolve(blocks);
                    });
                });
            });
    
            const checkrandomiseData = ((ET , block) =>{
                return new Promise((resolve , reject)=>{
                    const url = `SELECT ElectionBlock , P0 , P1 , P2 , P3 FROM randomisation2 WHERE ElectionName = ? AND ElectionBlock IN (?) ;`;
                    connection.query(url,[ET,block],(err,result)=>{
                        if(err) return reject(err);
    
                        if(result.length === 0){
                            return reject(new Error("No data available for this Election"));
                        }
    
                        resolve(result.map(val => ({
                        ElectionBlock: val.ElectionBlock,
                        P0: val.P0,
                        P1: val.P1,
                        P2: val.P2,
                        P3: val.P3
                        })));
    
                    });
                });
            });
        
            const block = await blockdata(ET);
            const randomisationdata = await checkrandomiseData(ET , block);

            console.log(block , randomisationdata);
            const electionBlocks = [...new Set(randomisationdata.map(val => val.ElectionBlock))]; // ✅ Distinct values only
            const allBlocksAvailable = block.every(b => electionBlocks.includes(b));
            
            if(allBlocksAvailable){
                console.log(electionBlocks);
                res.status(200).json({
                    success : true,
                    message : "all block data is available for Randomisation 3",
                    block   : electionBlocks,
                });
            }else{
                res.status(404).json({
                    success : false,
                    message : "All Block Data is not Available for Randomisation 2",
    
                });
            }
        } catch (error) {
            console.error("Error in /checkrandomisation2Data:", error.message);
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    });


router.get("/Randomisation3", async(req , res)=>{
    const {ET , block} = req.query;
    try {
        const id = await blockid(ET, block);
        const blockps = await psvalues(id);
        const Postgroupid = await randomisation2group(ET, block , blockps );
        const extra = await extrapost(ET , block);
        const randomisedata = await startrandmisation3(blockps , Postgroupid , ET);
        res.status(200).json({
            success : true,
            block,
            randomisedata,
            extra
        });
    } catch (error) {
        console.error("Error in /Randomisation3:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

const blockid = (ET , block) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select id from electionbodydata where ElectionName = ? and ElectionBlocks = ?;`,[ET,block],(err , result)=>{
            if(err) return reject(err);

            const id = result.map(val => val.id);
            resolve(id); 
        });
    });
}

const psvalues = (id) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select PS from pollingstations where ElectionId In (?) `,[id],(err , result)=>{
            if(err) return reject(err);

            const ps = result.map(val => val.PS);
            resolve(ps);
        });
    });
}

const randomisation2group = (ET, block , blockps ) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select id from randomisation2 where ElectionName = ? and ElectionBlock = ? ;`,[ET , block],(err,result)=>{
            if(err)return reject(err);

            const pid = result.map(val => val.id);
            resolve(pid);
        })
    });
}

const extrapost = async (et , block) =>{
     try {
    const [rows] = await connection.promise().query(
      `SELECT ElectionBlock, Extra5Percent 
       FROM randomisation5percentextra1 
       WHERE ElectionName = ? AND ElectionBlock = ?`,
      [et , block]
    );

    for (const row of rows) {
      if (row.Extra5Percent) {
        // Handle both single value and comma-separated multiple values
        let codes = row.Extra5Percent;

        if (typeof codes === "string") {
          // If it's a string, split by comma into array
          codes = codes.split(",").map(c => c.trim()).filter(Boolean);
        } else if (!Array.isArray(codes)) {
          // If it's a single non-string value, wrap in array
          codes = [codes];
        }

        if (codes.length > 0) {
          const [extraRows] = await connection.promise().query(
            `SELECT Employee_code, CONCAT(Employee_FName, ' ', Employee_LName) AS EmployeeName
             FROM employee_data
             WHERE Employee_code IN (?)`,
            [codes]
          );
          row.extraDetails = extraRows;
        } else {
          row.extraDetails = [];
        }
      } else {
        row.extraDetails = [];
      }
    }

    return rows;
  } catch (err) {
    console.error("Error in fetchextra:", err.message);
    return [];
  }
}

const startrandmisation3 = (ps, id, ET) => {
    return new Promise((resolve, reject) => {
        const shuffle = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        const shuffledId = shuffle([...id]);
        const shuffledPs = shuffle([...ps]);

        // Join employee_data for names
        const sql = `
            SELECT r.id,
                   r.P0, CONCAT(e0.Employee_FName, ' ', e0.Employee_LName) AS P0Name,
                   r.P1, CONCAT(e1.Employee_FName, ' ', e1.Employee_LName) AS P1Name,
                   r.P2, CONCAT(e2.Employee_FName, ' ', e2.Employee_LName) AS P2Name,
                   r.P3, CONCAT(e3.Employee_FName, ' ', e3.Employee_LName) AS P3Name
            FROM randomisation2 r
            LEFT JOIN employee_data e0 ON r.P0 = e0.Employee_code
            LEFT JOIN employee_data e1 ON r.P1 = e1.Employee_code
            LEFT JOIN employee_data e2 ON r.P2 = e2.Employee_code
            LEFT JOIN employee_data e3 ON r.P3 = e3.Employee_code
            WHERE r.ElectionName = ? AND r.id IN (?)`;

        connection.query(sql, [ET, shuffledId], (err, result) => {
            if (err) return reject(err);

            const resultMap = {};
            result.forEach(row => {
                resultMap[row.id] = row;
            });

            const Combined = shuffledId.map((id, index) => {
                const row = resultMap[id] || {};
                return {
                    ...row,
                    pollingStation: shuffledPs[index]
                };
            });
            
            resolve(Combined);
        });
    });
};




router.post("/saveRandomisation3",async(req,res)=>{
    const {ET , data } = req.body;
    const { block, ps, id } = data[0];
    try {
        const deletedata = await deleteBlockData(ET , block);
        if(deletedata){
        const insertdata = await insertBlockdata(ET , block , ps , id);
        if(insertdata){
            res.status(200).json({ success: true, block : block });
        }
        }else{
            res.json({
                success : false,
                message : "deletion is not completed "
            })
        }
        
    } catch (error) {
            console.error("Error in /saveRandomisation3:", error.message);
            res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

const deleteBlockData = (ET , block) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`delete from randomisation3 where ElectionName = ? and ElectionBlock = ?`,[ET , block],(err,result)=>{
            if(err) return reject(err);
            resolve(true);
        });
    });
}

const insertBlockdata = (ET, block, ps, id) => {
    return new Promise((resolve, reject) => {
        // Prepare insert queries for each ps-id pair
        const values = [];

        for (let i = 0; i < ps.length; i++) {
            values.push([ET, block, ps[i], id[i]]);
        }

        const sql = `INSERT INTO randomisation3 (ElectionName, ElectionBlock, PS , R2id) VALUES ?`;

        connection.query(sql, [values], (err, result) => {
            if (err) return reject(err);
            resolve(true);
        });
    });
}

router.delete("/resetallRandomisation3", async (req,res)=>{
    const {ET} = req.query;
    try {
        const success1 = await deleteALLR3(ET); 
    
        if(success1){
            res.status(200).json({
                success : true,
                message : "Radomisation 3 Data Deleted Succesfully"
            });
        }
    } catch (error) {
         console.error("Database error:", err.message);
         return res.status(500).json({ success: false, message: "Database error" });
    }
    });
    
    const deleteALLR3 = (ET) =>{
        return new Promise((resolve , reject)=>{
            connection.query(`DELETE FROM randomisation3 WHERE ElectionName = ?`,[ET],(err,result)=>{
                if(err) return(err);
    
                resolve(true);
            });
        });
    }


router.get("/checkdataR3",async (req , res)=>{
        const {ET} = req.query;
        try {
            const ids = await getallids(ET);
            const group = await getallgroupdata(ids , ET );
            const extradata = await fetchextra(ET);
            console.log(ids , group , extradata);
            // const data = mergeRandomisationData(group, extradata);
             if (ids.length > 0 && group.length > 0) {
                
                res.status(200).json({
                    success: true,
                    group,
                    extradata,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "data is not available"
                });
            }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                success: false,
                message: "Server error",
                error
            });
        }
    });

const getallids = (ET) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select PS , R2id from randomisation3 where ElectionName = ? `,[ET],(err , result)=>{
            if(err) return reject(err);

            resolve(result);
        });
    });
}

const getallgroupdata = async (ids, et) => {
  try {
    const idList = ids.map(i => i.R2id); // extract list of IDs

    // Query with employee joins
    const [rows] = await connection.promise().query(
      `SELECT r.id, r.ElectionBlock,
              r.P0, CONCAT(e0.Employee_FName, ' ', e0.Employee_LName) AS P0Name,
              r.P1, CONCAT(e1.Employee_FName, ' ', e1.Employee_LName) AS P1Name,
              r.P2, CONCAT(e2.Employee_FName, ' ', e2.Employee_LName) AS P2Name,
              r.P3, CONCAT(e3.Employee_FName, ' ', e3.Employee_LName) AS P3Name
       FROM randomisation2 r
       LEFT JOIN employee_data e0 ON r.P0 = e0.Employee_code
       LEFT JOIN employee_data e1 ON r.P1 = e1.Employee_code
       LEFT JOIN employee_data e2 ON r.P2 = e2.Employee_code
       LEFT JOIN employee_data e3 ON r.P3 = e3.Employee_code
       WHERE r.ElectionName = ? AND r.id IN (?)`,
      [et, idList]
    );

    // Create a map from R2id → PS
    const psMap = {};
    ids.forEach(item => {
      psMap[item.R2id] = item.PS;
    });

    // Merge PS into each row
    const mergedResults = rows.map(row => ({
      ...row,
      PS: psMap[row.id] || null
    }));

    return mergedResults;

  } catch (err) {
    console.error("Error in getallgroupdata:", err.message);
    return [];
  }
};



const fetchextra = async (et) => {
  try {
    const [rows] = await connection.promise().query(
      `SELECT ElectionBlock, Extra5Percent 
       FROM randomisation5percentextra1 
       WHERE ElectionName = ?`,
      [et]
    );

    for (const row of rows) {
      if (row.Extra5Percent) {
        // Handle both single value and comma-separated multiple values
        let codes = row.Extra5Percent;

        if (typeof codes === "string") {
          // If it's a string, split by comma into array
          codes = codes.split(",").map(c => c.trim()).filter(Boolean);
        } else if (!Array.isArray(codes)) {
          // If it's a single non-string value, wrap in array
          codes = [codes];
        }

        if (codes.length > 0) {
          const [extraRows] = await connection.promise().query(
            `SELECT Employee_code, CONCAT(Employee_FName, ' ', Employee_LName) AS EmployeeName
             FROM employee_data
             WHERE Employee_code IN (?)`,
            [codes]
          );
          row.extraDetails = extraRows;
        } else {
          row.extraDetails = [];
        }
      } else {
        row.extraDetails = [];
      }
    }

    return rows;
  } catch (err) {
    console.error("Error in fetchextra:", err.message);
    return [];
  }
};

module.exports = router;