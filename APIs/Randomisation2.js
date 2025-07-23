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


router.get('/Radomisation2',async(req,res)=>{
    const {ET , block} = req.query;

    try {
        const ps = await pollingdataR2(ET, block);
        const groups = await pollgroupsR2(ET , block , ps)
        const extra = await extraemp(ET, block);

        if(ps.length !== groups.length){
            throw new Error("polling station do not match with number of groups");
        }

        res.status(200).json({
            success : true,
            groups : groups,
            extra : extra,
            PS : ps,
        })
    } catch (error) {
        console.error("Error in /Randomisation2:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});


const pollingdataR2 = (ET , block)=>{
    return new Promise((resolve , reject)=>{
        connection.query(`SELECT  id FROM electionbodydata WHERE ElectionName = ? AND ElectionBlocks = ?`,[ET, block],(err , result)=>{
            if(err) return reject(err);

            if(result.length === 0){
                return reject(new Error(`no data found of this block = ${block}`));
            }
            const blockid = result.map(val => val.id);

            connection.query(`SELECT PS FROM pollingstations WHERE ElectionId In (?)`,[blockid],(err2,result2)=>{
                if(err2) return reject(err2);

                if(result2.length === 0){
                    return reject(new Error(`System collapsed Please contact Dev`));
                }

                const ps = result2.map(val => val.PS);
                resolve(ps);
            });
        });
    });
}

const pollgroupsR2 = (ET, block, ps) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await randomisedata(ET, block);

            if (!data || data.length === 0 || ps.length !== data.length) {
                return resolve([]);
            }

            // Separate each column into its own array
            const p0Array = data.map(row => row.P0);
            const p1Array = data.map(row => row.P1);
            const p2Array = data.map(row => row.P2);
            const p3Array = data.map(row => row.P3);

            // Shuffle each array independently
            const shuffle = (arr) => {
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr;
            };

            shuffle(p0Array);
            shuffle(p1Array);
            shuffle(p2Array);
            shuffle(p3Array);

            // Combine shuffled arrays into groups
            const groups = [];
            for (let i = 0; i < data.length; i++) {
                groups.push({
                    P0: p0Array[i],
                    P1: p1Array[i],
                    P2: p2Array[i],
                    P3: p3Array[i]
                });
            }

            resolve(groups);
        } catch (err) {
            reject(err);
        }
    });
};


const randomisedata = (et , block) =>{
    return new Promise((resolve , reject)=>{
        const url = ` SELECT P0 ,P1, P2 , P3 FROM randomisation1 WHERE ElectionName = ? AND ElectionBlock = ?;`;
        connection.query(url , [et , block],(err,result)=>{
            if(err) return reject(err);

            if(result.length === 0){
                return reject(new Error(" Randomisation system collapsed please contact dev"));
            }
            resolve(result);
        })
    })
}

const extraemp = (ET , block) =>{
    return new Promise((resolve , reject )=>{
        connection.query(`SELECT Extra5Percent FROM randomisation5percentextra1 WHERE ElectionName = ? AND ElectionBlock = ?`,[ET , block],(err,result)=>{
            if(err) return reject(err);

            if(result.length === 0){
                 return reject(new Error(" Randomisation system collapsed please contact dev"));
            }
            const data = result.map(val => val.Extra5Percent)
            resolve(data);
        });
    });
}


router.post("/saveRandomisation2",async(req, res) => {
    const {ET , block , data} = req.body
    try {
        const deleted = await deletedR2(ET.trim(), block.trim());
          if (deleted){
            // Insert all rows using Promise.all
            const insertPromises = data.map(i => {
                return new Promise((resolve, reject) => {
                    connection.query(
                        `INSERT INTO randomisation2 (ElectionName, ElectionBlock, P0, P1, P2, P3) VALUES (?, ?, ?, ?, ?, ?)`,
                        [ET, block, i.P0, i.P1, i.P2, i.P3],
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(true);
                        }
                    );
                });
            });

            await Promise.all(insertPromises);
        }
       res.status(200).json({ success: true, block : block });
    } catch (error) {
            console.error("Error in /saveRandomisation2:", error.message);
            res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

const deletedR2 = (ET , Block)=>{
    return new Promise((resolve , reject)=>{
            connection.query(` delete from randomisation2 where ElectionName = ? and ElectionBlock = ? `,[ET,Block],(err,result)=>{
                if(err) return reject(err);
                resolve(true);
            });
    });
}

router.get("/checkdataR2", async (req, res) => {
    const { ET } = req.query;
    try {
        const blockdata = await callblockdataR2(ET);
        const ps = await callps(blockdata);
        const group = await callR2data(ET, blockdata);
        const extra = await callR2extradata(ET, blockdata);
        console.log(group, extra, ps)
        const data = mergeRandomisationData(group, extra, ps);

        if (ps.length > 0 && group.length > 0 && data.length > 0) {
            res.status(200).json({
                success: true,
                group: data,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "data is not available"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error
        });
    }
});

const callblockdataR2 = (ET) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT id, ElectionBlocks FROM electionbodydata WHERE ElectionName = ?", [ET], (err, result) => {
            if (err) return reject(err);
            const block = result.map(val => ({ id: val.id, ElectionBlock: val.ElectionBlocks }));
            resolve(block);
        });
    });
};

const callps = (blockdata) => {
  return new Promise((resolve, reject) => {
    const blockIds = blockdata.map(val => val.id);
    if (blockIds.length === 0) return resolve([]);

    connection.query(
      `SELECT ElectionId, PS FROM pollingstations WHERE ElectionId IN (?)`,
      [blockIds],
      (err, result) => {
        if (err) return reject(err);

        // Map ElectionId to ElectionBlock using blockdata
        const idToBlock = {};
        blockdata.forEach(block => {
          idToBlock[block.id] = block.ElectionBlock;
        });

        // Create mapped PS list with ElectionBlock
        const psMapped = result.map(row => ({
          ElectionBlock: idToBlock[row.ElectionId],
          PS: row.PS
        }));

        resolve(psMapped); // Now ready for merge function
      }
    );
  });
};


const callR2data = (ET, blockdata) => {
    return new Promise((resolve, reject) => {
        const blocks = blockdata.map(val => val.ElectionBlock);
        if (blocks.length === 0) return resolve([]);
        connection.query("SELECT ElectionBlock, P0, P1, P2, P3 FROM randomisation2 WHERE ElectionName = ? AND ElectionBlock IN (?)", [ET, blocks], (err, result) => {
            if (err) return reject(err);
            const group = result.map(val => ({
                ElectionBlock: val.ElectionBlock,
                P0: val.P0,
                P1: val.P1,
                P2: val.P2,
                P3: val.P3
            }));
            resolve(group);
        });
    });
};

const callR2extradata = (ET, blockdata) => {
    return new Promise((resolve, reject) => {
        const blocks = blockdata.map(val => val.ElectionBlock);
        if (blocks.length === 0) return resolve([]);
        connection.query("SELECT ElectionBlock, Extra5Percent FROM randomisation5percentextra1 WHERE ElectionName = ? AND ElectionBlock IN (?)", [ET, blocks], (err, result) => {
            if (err) return reject(err);
            const extra = result.map(val => ({
                ElectionBlock: val.ElectionBlock,
                Extra5Percent: val.Extra5Percent
            }));
            resolve(extra);
        });
    });
};

function mergeRandomisationData(randomise1data, extraRandomiseData, psList) {
    const extraMap = {};
    extraRandomiseData.forEach(item => {
        extraMap[item.ElectionBlock] = item.Extra5Percent;
    });

    const psByBlock = {};  // Map PS per block (assuming psList is not already mapped)
   psList.forEach(({ ElectionBlock, PS }) => {
    if (!psByBlock[ElectionBlock]) psByBlock[ElectionBlock] = [];
    psByBlock[ElectionBlock].push(PS);
});


    return randomise1data.map(item => ({
        ...item,
        Extra5Percent: extraMap[item.ElectionBlock] || null,
        PS: psByBlock[item.ElectionBlock] || []
    }));
}


router.delete("/resetallRandomisation2", async (req , res)=>{
const {ET} = req.query;
try {
    const success1 = await deleteALLR2(ET); 

    if(success1){
        res.status(200).json({
            success : true,
            message : "Radomisation 2 Data Deleted Succesfully"
        });
    }
} catch (error) {
     console.error("Database error:", err.message);
     return res.status(500).json({ success: false, message: "Database error" });
}
});

const deleteALLR2 = (ET) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`DELETE FROM randomisation2 WHERE ElectionName = ?`,[ET],(err,result)=>{
            if(err) return(err);

            resolve(true);
        });
    });
}



module.exports = router;