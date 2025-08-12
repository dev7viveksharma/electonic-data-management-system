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


router.get("/maxpoll",(req,res)=>{
    const {ET} = req.query;
    const q =  `SELECT NumberofBooths FROM electionbodydata WHERE ElectionName = ?`;
    connection.query(q,[ET],(err,result)=>{
          if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        const sum = result.reduce((ps , val) => ps + Number(val.NumberofBooths),0);
        res.json({
            success : true,
            result : sum
        });
    });
});


router.get("/getallpoollsdata",(req,res)=>{
      const q =  `SELECT PS FROM pollingstations`;
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
router.delete("/DeletePSdata",(req,res)=>{
    const {id , ET  } = req.body;
    const q =  `DELETE FROM pollingstations
                WHERE ElectionId IN (
                SELECT id FROM electionbodydata
                WHERE DmId = ? AND ElectionName = ? 
                ); `;
    connection.query(q,[id , ET ],(err , result)=>{
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({
            success : true,
        });
    });
});


router.post("/insertdata",(req,res)=>{
    const {id ,ET , Block , ps } = req.body;
    if (!Array.isArray(ps) || ps.length === 0) {
        return res.status(400).json({ success: false, message: "Polling stations list is empty" });
    }

    const electionid= `select id from electionbodydata where DmId = ? and ElectionName = ? and ElectionBlocks = ?;`;
    connection.query(electionid,[id,ET,Block],(err,result)=>{
        if (err) {
            console.error("Error fetching ElectionId:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Election entry not found" });
        }
        const electionId = result[0].id;

        const values = ps.map(ps=>[electionId,ps]);

        const query = `insert into pollingstations (ElectionId, PS) values ?;`;
        connection.query(query,[values],(err,result)=>{
                if (err) {
                    console.error("Error inserting PS list:", err);
                    return res.status(500).json({ success: false, message: "Insert failed" });
                }

            res.json({
                success: true,
                message: "Polling stations inserted successfully",
                result: result.affectedRows
            });
        });
    });
});


router.get("/inspectdataentry", (req, res) => {
    const { ET } = req.query;

    // Step 1: Get ALL ElectionBlocks for the ElectionName
    connection.query(
        "SELECT ElectionBlocks FROM electionbodydata WHERE ElectionName = ?",
        [ET],
        (err, blockResult) => {
            if (err) {
                console.error("Error fetching ElectionBlocks:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }

            if (blockResult.length === 0) {
                return res.status(404).json({ success: false, message: "No ElectionBlocks found" });
            }

            const blocks = blockResult.map(row => row.ElectionBlocks);
            const blockPlaceholders = blocks.map(() => '?').join(', ');

            // Step 2: Get all IDs where ElectionName and ElectionBlocks match
            const idQuery = `SELECT id FROM electionbodydata WHERE ElectionName = ? AND ElectionBlocks IN (${blockPlaceholders})`;
            connection.query(idQuery, [ET, ...blocks], (err, idResult) => {
                if (err) {
                    console.error("Error fetching ElectionId:", err);
                    return res.status(500).json({ success: false, message: "Database error" });
                }

                if (idResult.length === 0) {
                    return res.status(404).json({ success: false, message: "Election entry not found" });
                }

                const electionIds = idResult.map(row => row.id);
                const placeholders = electionIds.map(() => '?').join(', ');
                const sql = `SELECT DISTINCT ElectionId FROM pollingstations WHERE ElectionId IN (${placeholders})`;

                connection.query(sql, electionIds, (err, foundResult) => {
                    if (err) {
                        console.error("Error querying pollingstations:", err);
                        return res.status(500).json({ success: false });
                    }

                    const foundIds = foundResult.map(row => row.ElectionId);

                    return res.json({
                        success: true,
                        foundIds,
                        missingIds: electionIds.filter(id => !foundIds.includes(id))
                    });
                });
            });
        }
    );
});



module.exports = router;