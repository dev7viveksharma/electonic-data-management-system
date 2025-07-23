const express = require("express");
const sql = require("mysql2");
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.get(`/checkrandomise2data`, async (req,res)=>{
    const {ET} = req.query;
    console.log(ET);
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
    
            const checkrandomiseData = ((ET , block) =>{
                return new Promise((resolve , reject)=>{
                    const url = `SELECT ElectionBlock , P0 , P1 , P2 , P3 FROM randomisation2 WHERE ElectionName = ? AND ElectionBlock IN (?) ;`;
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

            console.log(block , randomisationdata);
            const electionBlocks = randomisationdata.map(val => val.ElectionBlock); // ✅ CORRECT
            const allBlocksAvailable = block.every(b => electionBlocks.includes(b));
            
            if(allBlocksAvailable){
                res.status(200).json({
                    success : true,
                    message : "all block data is available for Randomisation 3",
                    block   : electionBlocks,
                });
            }else{
                res.status(404).json({
                    success : false,
                    message : "All Block Data is not Available for Randomisation 2",
    
                });
            }
        } catch (error) {
            console.error("Error in /checkrandomisation2Data:", error.message);
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    });


router.get("/Randomisation3", async(req , res)=>{
    const {ET , block} = req.query;
    try {
        const id = await blockid(ET, block);
        const blockps = await psvalues(id);
        const Postgroupid = await randomisation2group(ET, block , blockps );
        const extra = await extrapost(ET , block);
        const randomisedata = await startrandmisation3(blockps , Postgroupid , ET);
        res.status(200).json({
            success : true,
            block,
            randomisedata,
            extra
        });
    } catch (error) {
        console.error("Error in /Randomisation3:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

const blockid = (ET , block) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select id from electionbodydata where ElectionName = ? and ElectionBlocks = ?;`,[ET,block],(err , result)=>{
            if(err) return reject(err);

            const id = result.map(val => val.id);
            resolve(id); 
        });
    });
}

const psvalues = (id) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select PS from pollingstations where ElectionId In (?) `,[id],(err , result)=>{
            if(err) return reject(err);

            const ps = result.map(val => val.PS);
            resolve(ps);
        });
    });
}

const randomisation2group = (ET, block , blockps ) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select id from randomisation2 where ElectionName = ? and ElectionBlock = ? ;`,[ET , block],(err,result)=>{
            if(err)return reject(err);

            const pid = result.map(val => val.id);
            resolve(pid);
        })
    });
}

const extrapost = (ET , block) =>{
     return new Promise((resolve , reject)=>{
        connection.query(`select Extra5Percent from randomisation5percentextra1 where ElectionName = ? and ElectionBlock = ? ;`,[ET , block],(err,result)=>{
            if(err)return reject(err);

            const extra = result.map(val => val.Extra5Percent);
            resolve(extra);
        })
    });
}

const startrandmisation3 = (ps , id , ET) =>{
    return new Promise((resolve , reject)=>{
        const shuffle = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        const shuffledId  = shuffle([...id]);
        const shuffledPs  = shuffle([...ps]);

        connection.query(`select id , P0 , P1 , P2 , P3 from randomisation2 where ElectionName = ? and id In (?)`,[ET , shuffledId],(err,result)=>{
            if(err) return reject(err);

            const resultMap =  {};
            result.forEach(row => {
                    resultMap[row.id] = row;
                });

            const Combined = shuffledId.map((id , index)=>{
                const row = resultMap[id] || {};
                    return {
                        ...row,
                        pollingStation: shuffledPs[index]
                    };
            });

            resolve(Combined);
           
        });
    });
  
}

module.exports = router;