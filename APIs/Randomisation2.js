const { rejects } = require("assert");
const { error, table, Console } = require("console");
const { CONNREFUSED } = require("dns");
const express = require("express");
const sql = require("mysql2");
const { resolve } = require("path");
const { json } = require("stream/consumers");
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.get('/checkrandomisation1Data',async (req,res)=>{
    const {ET} = req.query;
    try {
        const blockdata = ((ET)=>{
            return new Promise((resolve , reject)=>{
                const url = `SELECT ElectionBlocks FROM electionbodydata WHERE ElectionName = ?;`;
                connection.query(url,[ET],(err,result)=>{
                    if(err) return reject(err);
    
                    if(result.length === 0){
                        return reject(new Error("Block data is not available for the associated election"));

                    }
    
                    const blocks = result.map(val => val.ElectionBlocks);
                    resolve(blocks);
                });
            });
        });

        const checkrandomiseData = ((  ET , block) =>{
            return new Promise((resolve , reject)=>{
                const url = `SELECT ElectionBlock , P0 , P1 , P2 , P3 FROM randomisation1 WHERE ElectionName = ? AND ElectionBlock IN (?) ;`;
                connection.query(url,[ET,block],(err,result)=>{
                    if(err) return reject(err);

                    if(result.length === 0){
                        return reject(new Error("No data available for this Election"));
                    }

                    resolve(result.map(val => ({
                    ElectionBlock: val.ElectionBlock,
                    P0: val.P0,
                    P1: val.P1,
                    P2: val.P2,
                    P3: val.P3
                    })));

                });
            });
        });
    
        const block = await blockdata(ET);
        const randomisationdata = await checkrandomiseData(ET , block);

        const electionBlocks = randomisationdata.map(val => val.ElectionBlock); // ✅ CORRECT
        const allBlocksAvailable = block.every(b => electionBlocks.includes(b));
        
        if(allBlocksAvailable){
            res.status(200).json({
                success : true,
                message : "all block data is available for Randomisation 2",
                block   : electionBlocks,
            });
        }else{
            res.status(404).json({
                success : false,
                message : "All Block Data is not Available for Randomisation 2",

            });
        }
    } catch (error) {
        console.error("Error in /checkrandomisation1Data:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;