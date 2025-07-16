const express = require("express");
const sql = require("mysql2")
const router = express.Router();
const multer = require('multer');

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});


router.get("/showHodList",(req,res)=>{
    const sql = ` select adminId , adminName from adminsignup`;
    connection.query(sql,(err,result)=>{
        if (err) {
            return res.status(500).json({ success: false, error: "Database Error" });
        }
        if(result.length === 0){
            res.status(404).send({ success : false, error : "No HOD Data Available"
            });
        }

        res.status(200).json({
            success : true,
            hoddata : result
        });
    });
});

module.exports = router;