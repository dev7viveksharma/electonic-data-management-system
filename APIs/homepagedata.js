const express = require("express");
const sql = require("mysql2")
const router = express.Router();
const multer = require('multer');
const path = require("path");

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});
router.get("/totalcountingdata",async(req,res)=>{
    try {
        const empcount = await employeescount();
        const hodcount = await hodnumber();
        const electoncount = await Electionname();

        res.status(200).json({
            success : true,
            empcount,
            hodcount,
            electoncount
        });
    } catch (error) {
           console.error("Error in /totalcountingdata:", error);
            res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

const employeescount = () =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select * from employee_data`,(err,result)=>{
            const count = result.length;
            resolve(count);
        }); 
    });
}

const hodnumber = () =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select * from adminsignup`,(err,result)=>{
            
            resolve(result.length);
        });

        
    });
}

const Electionname = () =>{
    return new Promise((resolve , reject)=>{
        connection.query(
                        `SELECT COUNT(DISTINCT ElectionName) AS TotalDistinctElections FROM electionbodydata`,
                        (err, result) => {
                            if (err) {
                            console.error("Query error:", err);
                            return;
                            }
                            const count = result[0].TotalDistinctElections;
                            resolve(count);
                        }
                        );
    });
}
module.exports = router;