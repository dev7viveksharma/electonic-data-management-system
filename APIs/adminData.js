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

router.post("/blockHods",(req , res)=>{
    const { action , empEmail, empName, empMobile,empDesignation} = req.body;

    const url = action === 'Block'?"update adminsignup set status = 'Unblock' where adminName = ? and adminEmail = ? and adminMobileNo = ? and adminDesignation = ? ":" update adminsignup set status = 'Block' where adminName = ? and adminEmail = ? and adminMobileNo = ? and adminDesignation = ? ";

    connection.query(url,[empName , empEmail , empMobile , empDesignation],(err,result)=>{
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        connection.query(`select status from adminsignup where adminName = ? and adminEmail = ? and adminMobileNo = ? and adminDesignation = ? `,[empName , empEmail , empMobile , empDesignation],(err,result)=>{
            if (err) {
                console.error("Database error:", err.message);
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.status(200).json({
                success : true,
                name : empName,
                action : result[0].status
            });
        });
    });
});
module.exports = router;