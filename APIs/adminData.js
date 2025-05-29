const express = require("express");
const sql = require("mysql2")
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.get("/Admindata",(req,res)=>{
    const {adminid} = req.query;
    const q = ' SELECT adminEmail,adminMobileNo FROM adminsignup WHERE adminId =?';
    connection.query(q,[adminid],(err,result)=>{
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, message: "Database error" });
            }
        console.log(result);
        res.json({
            success : true,
            result : result 
        });
    });
});

module.exports = router;