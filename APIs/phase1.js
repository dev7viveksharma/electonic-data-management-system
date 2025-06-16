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

router.get('/blockList',(req,res)=>{
    const {Election} = req.query;

    const q = `select ElectionBlocks from electionbodydata where ElectionName = ? ; `
    connection.query(q,[Election],(err , result)=>{
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

router.get('/showPSdata',(req,res)=>{
    const {ET , block ,id} = req.query;
    const q = `select electionbodydata.ElectionBlocks , electionbodydata.NumberofBooths , pollingstations.PS 
               FROM electionbodydata AS electionbodydata
               JOIN pollingstations AS pollingstations ON pollingstations.ElectionId = electionbodydata.id
               WHERE electionbodydata.DmId = ? AND electionbodydata.ElectionName = ? AND electionbodydata.ElectionBlocks = ?;
               `;
 
    connection.query(q,[id , ET , block],(err,result)=>{
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


router.get('/TotalBooths',(req,res)=>{
    const {block , Election} = req.query;
    const q = `select NumberofBooths from electionbodydata where ElectionName = ? and ElectionBlocks = ? ; `
    connection.query(q,[Election , block],(err , result)=>{
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


router.delete("/DeletePSdata",(req,res)=>{
    const {id , ET , Block } = req.body;
    const q =  `DELETE FROM pollingstations
                WHERE ElectionId IN (
                SELECT id FROM electionbodydata
                WHERE DmId = ? AND ElectionName = ? AND ElectionBlocks = ?
                ); `;
    connection.query(q,[id , ET , Block],(err , result)=>{
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        res.json({
            success : true,
        });
    });
});

module.exports = router;