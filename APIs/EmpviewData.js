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
router.get("/headVarifiedEmployee",(req,res)=>{
    const q = 'SELECT Employee_Image , Employee_code , Employee_FName , Employee_LName , Mobile_Number , Department , varified from employee_data where varified = "Varified"; ';
    connection.query(q,(err,result)=>{
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

router.get("/headNonVarifiedEmployee",(req,res)=>{
    const q = 'SELECT Employee_Image , Employee_code , Employee_FName , Employee_LName , Mobile_Number , Department , varified from employee_data where varified = "Not Varified"; ';
     connection.query(q,(err,result)=>{
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


router.get("/Hods",(req,res)=>{
    const q = `SELECT adminName , adminEmail , adminMobileNo , adminDesignation , status FROM adminsignup`
    connection.query(q,(err,result)=>{
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