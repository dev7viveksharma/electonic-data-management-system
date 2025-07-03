const express = require("express");
const mysql = require("mysql2");
const {v4:uuidv4} = require("uuid");
const bcrypt= require("bcrypt");
const path = require("path");
const { promises } = require("dns");
const router = express.Router();

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.get("/callEmpPosts", async (req, res) => {
    const { ET } = req.query;

    const getValues = (query, postKey) => {
    return new Promise((resolve, reject) => {
        connection.query(query, [ET], async (err, result) => {
            if (err) return reject(err);

            const enriched = await Promise.all(result.map(row => {
                return new Promise((resolveCount, rejectCount) => {
                    const postValue = row[postKey]; // e.g., "Lecturer"
                    const sql = `SELECT COUNT(*) AS count FROM employee_data WHERE Designation = ? AND varified = "Varified"`;

                    connection.query(sql, [postValue], (err2, result2) => {
                        if (err2) return rejectCount(err2);
                        resolveCount({
                            post: postValue,
                            selection: row.Selection,
                            count: result2[0].count || 0
                        });
                    });
                });
            }));

            resolve(enriched);
        });
    });
};


    const getCount = (designation) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS count FROM employee_data WHERE Designation = ? AND varified = "Varified"`;
            connection.query(sql, [designation], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].count);
            });
        });
    };

    const getLenders = ((table,P,ET)=>{
        const query = `SELECT ${P} from ${table} where Lender = "Yes" and ElectionType = ?`;
        return new Promise((resolve,reject)=>{
            connection.query(query,[ET],(err,result)=>{
                if(err) return reject(err);
                resolve(result)
            });
        });
    });

    const getExtra = (table, designations, ET) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(designations) || designations.length === 0) return resolve([]);
        
        const placeholders = designations.map(() => '?').join(',');
        const query = `SELECT currentposts, desigantionsRequired FROM ${table} WHERE desigantionsRequired IN (${placeholders}) AND ElectionType = ?`;

        connection.query(query, [...designations, ET], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


    try {
        const [P0, P1, P2, P3] = await Promise.all([
            getValues("SELECT P0, Selection FROM pollingofficersp0 WHERE ElectionType = ?", "P0"),
            getValues("SELECT P1, Selection FROM pollingofficersp1 WHERE ElectionType = ?", "P1"),
            getValues("SELECT P2, Selection FROM pollingofficersp2 WHERE ElectionType = ?", "P2"),
            getValues("SELECT P3, Selection FROM pollingofficersp3 WHERE ElectionType = ?", "P3")
        ]);

        const [countP0, countP1, countP2, countP3] = await Promise.all([
            getCount("P0"),
            getCount("P1"),
            getCount("P2"),
            getCount("P3")
        ]);

        const [LENDERP0 , LENDERP1, LENDERP2 , LENDERP3] = await Promise.all([
            getLenders("pollingofficersp0","P0",ET),
            getLenders("pollingofficersp1","P1",ET),
            getLenders("pollingofficersp2","P2",ET),
            getLenders("pollingofficersp3","P3",ET),
        ]);

        const [EXTRAP0 , EXTRAP1 , EXTRAP2 , EXTRAP3] = await Promise.all([
            getExtra("extraposts",LENDERP0.map(row => row.P0),ET),
            getExtra("extraposts",LENDERP1.map(row => row.P1),ET),
            getExtra("extraposts",LENDERP2.map(row => row.P2),ET),
            getExtra("extraposts",LENDERP3.map(row => row.P3),ET),
        ]);

        res.json({
            success: true,
            posts: {
                P0: { list: P0, count: countP0 },
                P1: { list: P1, count: countP1 },
                P2: { list: P2, count: countP2 },
                P3: { list: P3, count: countP3 }
            },
            Extraposts :{
                P0: EXTRAP0,
                P1: EXTRAP1,
                P2: EXTRAP2,
                P3: EXTRAP3
            }
        });
    } catch (err) {
        console.error("Error fetching posts or counts:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});



router.get("/selectpolls",(req,res)=>{
    const {ET} = req.query;
    const query = `SELECT id FROM electionbodydata WHERE ElectionName = ?;`;

    connection.query(query,[ET],(err,result)=>{
        if (err) {
            console.error("Error fetching ElectionId:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Election entry not found" });
        }

        const ids = result.map(row=>row.id);
        const placeholder = ids.map(() => '?').join(',');
        const secondQuery = `SELECT PS FROM pollingstations WHERE ElectionId IN (${placeholder})`;

        connection.query(secondQuery,ids,(err,result)=>{
            if (err) {
                console.error("Error fetching polling station data:", err);
                return res.status(500).json({ success: false, message: "Error fetching data" });
            }

            res.status(200).json({
                success : true,
                result
            });
        });
    });

});

router.post("/insertPollingPosts", async (req, res) => {
  const {
    ET, P0, P1, P2, P3,
    extraP1Array, extraP2Array, extraP3Array,
    extraP1, extraP2, extraP3
  } = req.body;

  const officerTables = [
    { table: "pollingofficersp0", column: "P0", selected: P0, extras: [...extraP1Array, ...extraP2Array, ...extraP3Array] },
    { table: "pollingofficersp1", column: "P1", selected: P1, extras: [...extraP2Array, ...extraP3Array] },
    { table: "pollingofficersp2", column: "P2", selected: P2, extras: [...extraP3Array] },
    { table: "pollingofficersp3", column: "P3", selected: P3, extras: [] } // No lender = yes for P3
  ];

  try {
    for (let { table, column, selected, extras } of officerTables) {
      const [rows] = await new Promise((resolve, reject) => {
        connection.query(`SELECT ${column} FROM ${table} WHERE ElectionType = ?`, [ET], (err, result) => {
          if (err) return reject(err);
          resolve([result]);
        });
      });

      for (let row of rows) {
        const post = row[column];
        const isSelected = selected.includes(post);
        const isLender = extras.includes(post);

        const updateQuery = `UPDATE ${table} SET Selection = ?, Lender = ? WHERE ${column} = ? AND ElectionType = ?`;
        const selection = isSelected ? "Selected" : "Not Selected";
        const lender = isLender ? "Yes" : "No";

        await new Promise((resolve, reject) => {
          connection.query(updateQuery, [selection, lender, post, ET], (err, result) => {
            if (err) return reject(err);
            resolve();
          });
        });
      }
    }

    // Insert extra posts
    const extraArray = [extraP1Array, extraP2Array, extraP3Array];
    const extraTypes = [extraP1, extraP2, extraP3];
    for (let i = 0; i < extraArray.length; i++) {
      if (extraArray[i].length > 0 && extraTypes[i]) {
        const inserted = await insertExtravalues(extraArray[i], extraTypes[i], ET, `P${i + 1}`);
        if (!inserted) throw new Error("Insert failed");
      }
    }

    res.json({ success: true, message: 'All rows updated with Selection and Lender status' });
  } catch (err) {
    console.error("Error in insertPollingPosts:", err);
    res.status(500).json({ success: false, message: 'Error updating tables', error: err });
  }
});

async function insertExtravalues(extralistArray, extradata, ET, currentpost) {
  try {
    const url = `INSERT INTO extraposts(ElectionType, currentposts, desigantionsRequired, extraEmp) VALUES (?, ?, ?, ?)`;
    for (let i of extralistArray) {
      await new Promise((resolve, reject) => {
        connection.query(url, [ET, currentpost, i, extradata], (err, result) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
    return true;
  } catch (error) {
    console.error("Error in insertExtravalues:", error);
    return false;
  }
}


router.delete("/deletepostsdetails", async (req, res) => {
    const { ET } = req.query;

    const actionhandlers = (tableName) => {
        return new Promise((resolve, reject) => {
            const sql1 = `
                UPDATE ${tableName}
                SET selection = 'Not Selected'
                WHERE ElectionType = ?
                AND EXISTS (
                    SELECT * FROM (
                        SELECT 1 FROM ${tableName}
                        WHERE selection = 'Selected' AND ElectionType = ?
                    ) AS temp
                )
            `;

            const sql2 = `
                UPDATE ${tableName}
                SET Lender = 'No'
                WHERE ElectionType = ?
                AND EXISTS (
                    SELECT * FROM (
                        SELECT 1 FROM ${tableName}
                        WHERE Lender = 'Yes' AND ElectionType = ?
                    ) AS temp
                )
            `;

            connection.query(sql1, [ET, ET], (err1) => {
                if (err1) return reject(err1);

                connection.query(sql2, [ET, ET], (err2) => {
                    if (err2) return reject(err2);
                    resolve(`${tableName}: Updated`);
                });
            });
        });
    };

    const deleteExtras = new Promise((resolve, reject) => {
        const sql3 = `DELETE FROM extraposts WHERE ElectionType = ?`;
        connection.query(sql3, [ET], (err, result) => {
            if (err) return reject(err);
            resolve("extraposts deleted");
        });
    });

    try {
        const [updateResults, deleteResult] = await Promise.all([
            Promise.all([
                actionhandlers("pollingofficersp0"),
                actionhandlers("pollingofficersp1"),
                actionhandlers("pollingofficersp2"),
                actionhandlers("pollingofficersp3"),
            ]),
            deleteExtras
        ]);

        res.json({
            success: true,
            message: 'All updates and deletes successful',
            updateResults,
            deleteResult
        });
    } catch (error) {
        console.error("API error:", error.message);
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
});


router.post("/searchSelectedPosts",async (req,res)=>{
    const {ET,P0,P1,P2,P3,EXP1,EXP2,EXP3} = req.body;
    const actionhandlers  = async (tableName , post,index)=>{
        // if array is undefind or null
        if (!post) return Promise.resolve([]);
        // conversion of string to array
        const items = Array.isArray(post) ? post : [post];
        const promise = items.map(i =>{
        const sql1 = `SELECT COUNT(Selection) as count FROM ${tableName} WHERE P${index} = ? AND ElectionType = ? ;`;
        return new Promise((resolve,reject)=>{
                 connection.query(sql1,[i,ET],(err,result)=>{
                    if(err) reject(err);
                    resolve(result[0].count);
                 });
            });
        });

        const counts = await Promise.all(promise);
        return counts.reduce((sum, curr) => sum + curr, 0); // return total count
    }

const actionhandlersEXTRA = async (dataArray, postLevel) => {
    if (!dataArray || !dataArray.length) return 0;

    const items = Array.isArray(dataArray) ? dataArray : [dataArray];

    const promises = items.map(designation => {
        const sql = `
            SELECT COUNT(*) AS count 
            FROM extraposts 
            WHERE ElectionType = ? 
              AND desigantionsRequired = ? 
              AND currentposts = ?
        `;

        return new Promise((resolve, reject) => {
            connection.query(sql, [ET, designation, postLevel], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].count > 0 ? 1 : 0); // ✅ Only 1 if match exists
            });
        });
    });

    const counts = await Promise.all(promises);
    return counts.reduce((sum, val) => sum + val, 0); // Total distinct matches
};



try {

    const [COUNTP0 , COUNTP1, COUNTP2 , COUNTP3] = await Promise.all([
        actionhandlers("pollingofficersp0" , P0,0),
        actionhandlers("pollingofficersp1" , P1,1),
        actionhandlers("pollingofficersp2" , P2,2),
        actionhandlers("pollingofficersp3" , P3,3)        
    ]);

    const extraResults = {};

    if (EXP1 && (Array.isArray(EXP1) ? EXP1.length : EXP1.trim() !== "")) {
        extraResults.EXP1 = await actionhandlersEXTRA( EXP1 , "P1");
    }
    if (EXP2 && (Array.isArray(EXP2) ? EXP2.length : EXP2.trim() !== "")) {
        extraResults.EXP2 = await actionhandlersEXTRA( EXP2 , "P2");
    }
    if (EXP3 && (Array.isArray(EXP3) ? EXP3.length : EXP3.trim() !== "")) {
        extraResults.EXP3 = await actionhandlersEXTRA( EXP3 , "P3");
    }



    res.status(200).json({
        success : true,
        count : {
            P0 : COUNTP0,
            P1 : COUNTP1,
            P2 : COUNTP2, 
            P3 : COUNTP3
        },
        EXCount :{
            EXP1: extraResults.EXP1 || [],
            EXP2: extraResults.EXP2 || [],
            EXP3: extraResults.EXP3 || []
        }
    });
    } catch (error) {
        console.error("Error in /searchSelectedPosts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


module.exports = router;