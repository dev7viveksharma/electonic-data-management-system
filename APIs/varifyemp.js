const express = require("express");
const sql = require("mysql2")
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.post("/NonVarifiedEmployee/varify",(req,res)=>{
    const {empcode} = req.body;
    const query = `UPDATE employee_data SET varified = 'Varified' WHERE Employee_code = ?`;
    connection.query(query,[empcode],(err,result)=>{
        if(err){
            console.error("Error updating employee:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json({
            success: true,
            message:"Employee Varified Successfully",
            result
        });
    }); 
});

router.post("/NonVarifiedEmployee/unvarify",(req,res)=>{
    const {empcode} = req.body;
    const query = `UPDATE employee_data SET varified = 'Not Varified' WHERE Employee_code = ?`;
    connection.query(query,[empcode],(err,result)=>{
        if(err){
            console.error("Error updating employee:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json({
            success: true,
            message:"Employee Varified Successfully",
            result
        });
    }); 
});

module.exports = router;