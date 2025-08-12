const express = require("express");
const mysql = require("mysql2");
const {v4:uuidv4} = require("uuid");
const bcrypt= require("bcrypt");
const path = require("path");
const router = express.Router();

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});
router.get("/VarifiedEmployee",(req,res)=>{
    const { department } = req.query;
    const q = 'SELECT Employee_Image , Employee_code , Employee_FName , Employee_LName , Mobile_Number , Department , varified from employee_data where varified = "Varified" AND Department = ?; ';
    connection.query(q,[department],(err,result)=>{
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, message: "Database error" });
            }

        res.json({
            success : true,
            result : result 
        });
    });
});

router.get("/NonVarifiedEmployee",(req,res)=>{
    const { department } = req.query;
    const q = 'SELECT Employee_Image , Employee_code , Employee_FName , Employee_LName , Mobile_Number , Department , varified from employee_data where varified = "Not Varified" AND Department = ?; '
     connection.query(q,[department],(err,result)=>{
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, message: "Database error" });
            }

        res.json({
            success : true,
            result : result 
        });
    });
});

module.exports = router;