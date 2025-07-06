const express = require("express");
const mysql = require("mysql2");
const {v4:uuidv4} = require("uuid");
const bcrypt= require("bcrypt");
const path = require("path");
const { promises } = require("dns");
const { table } = require("console");
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
    if(extraP1Array.length > 0 || extraP2Array.length > 0 || extraP2Array.length > 0){
        await new Promise((resolve, reject) => {
            connection.query(`DELETE FROM extraposts WHERE ElectionType = ?`, [ET], (err, result) => {
                if (err) return reject(err);
                resolve();
            });
        });

    }
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


router.get("/searchSelectedPosts",async (req,res)=>{
    const {ET} = req.query;
    actionhandlers = ((ET , tableName , designation)=>{
        return new Promise((resolve , reject)=>{
            connection.query(`SELECT ${designation} from ${tableName} where ElectionType = ? AND Selection = "Selected"`,[ET],(err,result)=>{
                if(err) return reject(err);
                resolve(result);
            });
        });
    });

    extraActionhandlers = ((ET , requirement )=>{
        return new Promise((resolve , reject)=>{
            const sql = `SELECT desigantionsRequired FROM extraposts WHERE ElectionType = ? AND currentposts = ?`;
            connection.query(sql,[ET,requirement],(err,result)=>{
                if(err) return reject(err);
                resolve(result);
            });
        });

    });

     const [P0] = await Promise.all([
        actionhandlers( ET, "pollingofficersp0", "P0")
    ]);
     const [P1] = await Promise.all([
        actionhandlers( ET, "pollingofficersp1", "P1")
    ]);
     const [P2] = await Promise.all([
        actionhandlers( ET, "pollingofficersp2", "P2")
    ]);
     const [P3] = await Promise.all([
        actionhandlers( ET, "pollingofficersp3", "P3")
    ]);

     const [EP1] = await Promise.all([
        extraActionhandlers( ET,"P1")
    ]);
     const [EP2] = await Promise.all([
        extraActionhandlers( ET,"P2")
    ]);
     const [EP3] = await Promise.all([
        extraActionhandlers( ET,"P3")
    ]);



try {
    res.status(200).json({
        success : true,
        count : {
            P0 : P0,
            P1 : P1,
            P2 : P2, 
            P3 : P3
        },
        EXCOUNT : {
            P1 : EP1,
            P2 : EP2,
            P3 : EP3
        }
    });
    } catch (error) {
        console.error("Error in /searchSelectedPosts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


module.exports = router;