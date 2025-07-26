const express = require("express");
const sql = require("mysql2")
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.get("/DMdata",(req,res)=>{
    const {id} = req.query;
    const q = ' SELECT Email , MobileNumber , Password FROM collector WHERE Id = ?';
    connection.query(q,[id],(err,result)=>{
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