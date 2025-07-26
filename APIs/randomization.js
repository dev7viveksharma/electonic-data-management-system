const { error, table, Console } = require("console");
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

router.get("/CheckPollingAndPostData",async(req,res)=>{
    const {ET} = req.query;
try {
    blockhandler = ((ET)=>{
        return new Promise((resolve,reject)=>{
            const url = ` select id from electionbodydata where ElectionName = ?`;
            connection.query(url,[ET],(err,result)=>{
                if(err)return reject(err);
                const ids = result.map(ids => ids.id);
                resolve(ids);
            });
        });
    });

    pollingstations = ((ids)=>{
        return new Promise((resolve,reject)=>{
            const url = `select PS from pollingstations where ElectionId In (?);`;
            connection.query(url,[ids],(err,result)=>{
                if(err)return reject(err);
                const PS = result.map(ps => ps.PS);
                resolve(PS);
            })
        });
    });

     posthandlers = ((ET , tableName , designation)=>{
        return new Promise((resolve , reject)=>{
            connection.query(`SELECT ${designation} from ${tableName} where ElectionType = ? AND Selection = "Selected"`,[ET],(err,result)=>{
                if(err) return reject(err);
                resolve(result.map(p => p[`${designation}`]));
            });
        });
    });

    employeeshandler = ((post) => {
        return new Promise((resolve, reject) => {
            if (!post || post.length === 0) {
                return reject(new Error("No designation provided for checking."));
            }

            const sql = `SELECT COUNT(*) as count FROM employee_data WHERE Designation IN (?) AND varified = 'Varified'`;
            connection.query(sql, [post], (err, result) => {
                    if (err) return reject(err);
                    
                    const count = result[0].count;
                    if (count === 0) {
                        return reject(new Error(`No verified employee found for designation(s): ${post}`));
                    }

                resolve(count);
                });
        });
    });


    extraemployeeshandler =((post)=>{
        return new Promise((resolve,reject)=>{
            const url = `select Count(*) as count from employee_data where Designation In (?) and varified = 'Varified';`;
            connection.query(url,[post],(err,result)=>{
                if(err)return reject(err);
               
                resolve(result[0].count);
            });
        });
    });

    extraposthandlers = ((ET, requirement) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT desigantionsRequired FROM extraposts WHERE ElectionType = ? AND currentposts = ?`;
        connection.query(sql, [ET, requirement], (err, result) => {
            if (err) return reject(err);
            if (!result || result.length === 0) return resolve([]);
            resolve(result.map(row => row.desigantionsRequired));
        });
    });
});


    const ids = await blockhandler(ET);           
    const psList = await pollingstations(ids);

   const [P0, P1, P2, P3] = await Promise.all([
            posthandlers(ET, "pollingofficersp0", "P0"),
            posthandlers(ET, "pollingofficersp1", "P1"),
            posthandlers(ET, "pollingofficersp2", "P2"),
            posthandlers(ET, "pollingofficersp3", "P3"),
        ]);
    const [EP1,EP2,EP3] = await Promise.all([
            extraposthandlers( ET,"P1"),
            extraposthandlers( ET,"P2"),
            extraposthandlers( ET,"P3"),
    ]);

    const postarray = [P0, P1, P2, P3];
    const extrapostarray = [EP1,EP2,EP3];
    const count = [0,0,0,0];
    const extracount = [0,0,0];

    for(let i = 0; i < postarray.length; i++){
        for (const post of postarray[i]){
            const value = await employeeshandler(post);
            count[i] += value;
        }
    }

    for (let i = 0; i < extrapostarray.length; i++) {
        for (const postArray of extrapostarray[i]) {
            const values = await extraemployeeshandler(postArray);
            extracount[i] += values;
        }
    }

        
    for(let i = 1; i < count.length; i++){
        count[i] += extracount[i - 1];
    }


    let pstotal = 0;
    psList.forEach((ps)=>{
        pstotal ++;
    });

    const extra5 = ((pstotal/100)*5);
    pstotal += extra5;

    let flag = true ;
    for(let i of count){
        if(i < pstotal){
            flag = false;
            break;
        }
    }


        if(flag){
            res.status(200).json({
                    success: true,
                    message: "Sufficient verified employees for all selected designations.",
                    requiredPosts: Math.ceil(pstotal),
                    availableEmployees: count
            });
        }else{
            res.status(404).json({
                success: false,
                message: "data is not matching",
        });
        }
    } catch (error) {
         // 🔴 Catching errors like "no verified employee found"
        console.error("Error in /CheckPollingAndPostData:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
            requiredPosts: 0,
            availableEmployees: 0,
        });
    }

});

router.get("/Randomisation1", async (req,res)=>{
    const {ET,Block} = req.query;
    let EMPP0 = [], EMPP1 = [], EMPP2 = [], EMPP3 = [], EXTRA_EMP = [];
try {

    const blockfinder = ((ET,Block)=>{
        return new Promise((resolve , reject)=>{
            connection.query(`select id from electionbodydata where ElectionName = ? and ElectionBlocks = ?;`,[ET,Block],(err,result)=>{
                if(err) return reject(err);

                if (!result || result.length === 0) return resolve([]);

                resolve(result);
            });
        });
    });

    const blockPsFinder = ((BlockId)=>{
       return new Promise((resolve , reject )=>{
            connection.query(`select PS from pollingstations where ElectionId = ?;`,[BlockId],(err,result)=>{
            if(err)return reject(err);
            resolve(result.map(val => val.PS));    
            });
        });
    });


    const blockIdResult = await blockfinder(ET,Block);
    const blockId = blockIdResult[0]?.id;

    const blockPs = await blockPsFinder(blockId);
    const totalEmpRequired = blockPs.length;


      EMPP0 = await FetchEmployees(totalEmpRequired, Block, ET, "P0", "p0" , undefined);
      EMPP1 = await FetchEmployees(totalEmpRequired, Block, ET, "P1", "p1" , EMPP0);
      EMPP2 = await FetchEmployees(totalEmpRequired, Block, ET, "P2", "p2" , EMPP0.concat(EMPP1));
      EMPP3 = await FetchEmployees(totalEmpRequired, Block, ET, "P3", "p3" , EMPP0.concat(EMPP1 , EMPP2));

console.log("Final randomised employees:", {
  EMPP0, EMPP1, EMPP2, EMPP3
});

const totalUsed = EMPP0.concat(EMPP1, EMPP2, EMPP3).map(e => e);
const totalCount = totalEmpRequired * 4; // total posts for P0–P3
const extraCount = Math.ceil(totalCount * 0.05);

// collect all used designations (add your extra designation logic if needed)
let usedDesignations = []; 
usedDesignations = await getUsedDesignations(ET);
console.log(usedDesignations);
// fetch 5% extra
EXTRA_EMP = await fetchExtraEmployees(usedDesignations, totalUsed, Block, extraCount);
console.log("extra",EXTRA_EMP);

res.status(200).json({
    success : true ,
    ps : blockPs,
    EMPP0,
    EMPP1,
    EMPP2,
    EMPP3,
    EXTRA_EMP : EXTRA_EMP.map(val => val.Employee_code)
});

} catch (error) {
    console.error("Error in /Randomisation1:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
            EMPP0,
            EMPP1,
            EMPP2,
            EMPP3,
            EXTRA_EMP :EXTRA_EMP.map(val => val.Employee_code)
        });
}
});


function FetchEmployees(total , block , ET , Post , tablename , previousCodes){
    return new Promise(async(resolve , reject)=>{
        let empcodearray = [];
        let currentlystoredarray = [];
        let extraarray = [];
        let flag = true;
        let fullfilled = true;
        while(fullfilled){
            let maxQueries = Math.min(100, total * 5);
            let extra = false;
            let designations = await designationfetcher(ET,Post ,tablename , flag);
            let designationarray = designations.map(val => val[`${Post}`]);
            while (true) {
                if (maxQueries <= 0) {
                    return reject(new Error(`Unable to fetch enough unique employees for ${Post}`));
                }

                maxQueries--;
                console.log(`Trying to fetch ${Post} employees. Attempts left: ${maxQueries}`);

                let currentlyStoredValues = await fetchcurrentdataO(ET, Post , block);
                currentlystoredarray = currentlyStoredValues.map(val => val[`${Post}`]);

                if (extra) {
                    const extraFetched = await extradesignationfetch(Post, ET, block);
                    const filtered = extraFetched.filter(emp =>
                        !previousCodes?.includes(emp.Employee_code)
                    );

                    extraarray = filtered.map(emp => emp.Employee_code);

                    if (extraarray.length === 0) {
                        console.warn(`No valid extra employees after filtering. Attempts left: ${maxQueries}`);
                        continue; // retry
                    }
                }

                const empcodeResult = await fetch1Employees(designationarray, total, block);
                empcodearray = empcodeResult.map(emp => emp.Employee_code);

                const combined = empcodearray.concat(extraarray);

                if (noConflict(combined, currentlystoredarray)) {
                    // Check if we fulfilled the required number
                    if (combined.length === total) {
                        resolve(combined);
                        break;
                    } else {
                        console.warn(`Not enough employees from main + extra. Trying extra...`);
                        extra = true; // try extra in next loop
                    }
                }
            }

            if((empcodearray.length + extraarray.length) === total){
                fullfilled = false;
                resolve(empcodearray.concat(extraarray));
            }
        }   
    });
    
}


function designationfetcher(ET , position , table , flag){
    return new Promise((resolve , reject)=>{
    const url =   flag ?` select ${position} from pollingofficers${table} where ElectionType = ?  and Selection = 'Selected' and Lender = 'No';`: ` select ${position} from pollingofficers${table} where ElectionType = ?  and Selection = 'Selected';`;
        connection.query(url,[ET],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

async function extradesignationfetch(post, ET, block) {
    try {
        // 1. Get required designations
        const extradesignation = await new Promise((resolve, reject) => {
            connection.query(
                `SELECT desigantionsRequired FROM extraposts WHERE ElectionType = ? AND currentposts = ?`,
                [ET, post],
                (err, result) => {
                    if (err) return reject(err);
                    const designations = result.map(val => val.desigantionsRequired);
                    resolve(designations);
                }
            );
        });

        // 2. Get how many extra employees are required
        const extrarequired = await new Promise((resolve, reject) => {
            connection.query(
                `SELECT DISTINCT extraEmp FROM extraposts WHERE ElectionType = ? AND currentposts = ?`,
                [ET, post],
                (err, result) => {
                    if (err) return reject(err);
                    // Assuming only one value is returned
                    resolve(result[0]?.extraEmp || 0);
                }
            );
        });

        if (extrarequired === 0) return [];


        // 3. Fetch random employees with those designations
        const extraEmployees = await new Promise((resolve, reject) => {
            connection.query(
                `SELECT Employee_code FROM employee_data 
                 WHERE Designation IN (?) 
                 AND varified = "Varified" 
                 AND Assembly_Constituency_of_Residence != ? 
                 AND Assembly_Constituency_of_Workplace != ? 
                 ORDER BY RAND() 
                 LIMIT ?`,
                [extradesignation, block, block, extrarequired],
                (err, result) => {
                    if (err) return reject(err);

                    resolve(result);
                }
            );
        });

        return extraEmployees;

    } catch (error) {
        throw new Error("Error in extradesignationfetch: " + error.message);
    }
}


function fetch1Employees(p , total , block){
    return new Promise((resolve , reject)=>{
        const url = `select Employee_code from employee_data where Designation In (?) and varified = "Varified" and Assembly_Constituency_of_Residence != ? and Assembly_Constituency_of_Workplace != ? and Gender = 'male' and Differently_abled = 'No' order by RAND() LIMIT ${total};`
        connection.query(url , [p,block,block],(err,result)=>{
            if(err) return reject(err);

            resolve(result);
        });
    });
}

function fetchcurrentdataO(et , p , block){
    return new Promise((resolve , reject )=>{
        const url = `select ${p} from randomisation1 where ElectionName = ? and ElectionBlock != ? `;
        connection.query(url,[et,block],(err,result)=>{
            if(err) return reject(err);

            resolve(result);
        }); 
    });
}

async function getUsedDesignations(ET, postLevels = ["P0", "P1", "P2", "P3"]) {
    try {
        const allDesignations = [];

        for (const post of postLevels) {
            const table = post.toLowerCase(); // "p0", "p1" etc.

            const result = await new Promise((resolve, reject) => {
                connection.query(
                    `SELECT ${post} AS designation FROM pollingofficers${table} 
                     WHERE ElectionType = ? AND Selection = 'Selected'`,
                    [ET],
                    (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows.map(row => row.designation));
                    }
                );
            });

            allDesignations.push(...result);
        }

        // Remove duplicates
        return [...new Set(allDesignations)];
    } catch (err) {
        console.error("Error in getUsedDesignations:", err.message);
        return [];
    }
}


async function fetchExtraEmployees(usedDesignations, usedEmpCodes, block, extraCount) {
    try {
        const extraEmployees = await new Promise((resolve, reject) => {
            connection.query(
                `SELECT Employee_code FROM employee_data 
                 WHERE Designation IN (?) 
                 AND varified = 'Varified'
                 AND Assembly_Constituency_of_Residence != ?
                 AND Assembly_Constituency_of_Workplace != ?
                 ORDER BY RAND()`,
                [usedDesignations, block, block],
                (err, result) => {
                    if (err) return reject(err);

                    // Remove duplicates
                    const usedSet = new Set(usedEmpCodes);
                    const uniqueExtra = result.filter(emp => !usedSet.has(emp.Employee_code));

                    // Only return required count
                    resolve(uniqueExtra.slice(0, extraCount));
                }
            );
        });

        return extraEmployees;
    } catch (error) {
        throw new Error("Error in fetchExtraEmployees: " + error.message);
    }
}


function noConflict(arr1, arr2) {
    const set = new Set(arr2);
    return arr1.every(code => !set.has(code));
}




router.post("/saveRandomisation1", async (req,res)=>{
    const {ET , Block , EMP0 , EMP1 , EMP2 , EMP3 , EXTRA } = req.body;

    try {

        const deletesuccess1 = await deleteblockEmp(ET , Block);
        const deletesuccess2 = await deleteblockExtraEmp(ET , Block);
        const deleteR2data = await deleteblockR2EMP(ET , Block);
        const deleteR3data = await deleteblockR3EMP(ET , Block);

        if(deletesuccess1 && deletesuccess2 && deleteR2data && deleteR3data){
            const insertsuccess1 = await insertblockEmp(ET , Block , EMP0 , EMP1 , EMP2 , EMP3 );
            const insertsuccess2 = await insertextra5Percent(ET , Block , EXTRA );

            if(insertsuccess1 && insertsuccess2){
                res.status(200).json({
                    success : true,
                    Block : Block,
                });
            }else{
            res.status(400).json({
                success : false ,
                message : "insertion failed",
            });
        }
        }else{
            res.status(400).json({
                success : false ,
                message : "Old Data Deletion Failed Please Try Again With Correct Data",
            });
        }
    } catch (error) {
          console.error("Error in /saveRandomisation1:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

const deleteblockEmp = ((ET , Block ,)=>{
    return new Promise((resolve , reject )=>{
        const url = ` delete from randomisation1 where ElectionName = ? and ElectionBlock = ? `;
        
        connection.query(url,[ET , Block],(err,result)=>{
            if(err) return reject(err);

            resolve(true);
        });
    });
});

const deleteblockExtraEmp = ((ET , Block ,)=>{
    return new Promise((resolve , reject )=>{
        const url = ` delete from randomisation5percentextra1 where ElectionName = ? and ElectionBlock = ? `;
        
        connection.query(url,[ET , Block],(err,result)=>{
            if(err) return reject(err);

            resolve(true);
        });
    });
});

const deleteblockR2EMP = ((ET,Block)=>{
     return new Promise((resolve , reject )=>{
        const url = ` delete from randomisation2 where ElectionName = ? and ElectionBlock = ? `;
        
        connection.query(url,[ET , Block],(err,result)=>{
            if(err) return reject(err);

            resolve(true);
        });
    });
});

const deleteblockR3EMP = ((ET,Block)=>{
     return new Promise((resolve , reject )=>{
        const url = ` delete from randomisation3 where ElectionName = ? and ElectionBlock = ? `;
        
        connection.query(url,[ET , Block],(err,result)=>{
            if(err) return reject(err);

            resolve(true);
        });
    });
});

const insertblockEmp = ((ET , Block , EMP0 , EMP1 , EMP2 , EMP3)=>{
    return new Promise((resolve , reject )=>{
        const url = ` insert into randomisation1(ElectionName , ElectionBlock , P0 , P1 , P2 , P3) value (?,?,?,?,?,?);`;
        
        connection.query(url,[ET , Block , EMP0 , EMP1 , EMP2 , EMP3],(err,result)=>{
            if(err) return reject(err);

            resolve(true);
        });
    });
});

const insertextra5Percent = ((ET , Block , EXTRA_EMP)=>{
    return new Promise((resolve , reject )=>{
        const url = ` insert into randomisation5percentextra1(ElectionName , ElectionBlock , Extra5Percent) value (?,?,?);`;
        
        connection.query(url,[ET , Block , EXTRA_EMP],(err,result)=>{
            if(err) return reject(err);

            resolve(true);
        });
    });
});



router.get("/checkPreExistingData",async (req , res)=>{
    const {ET} = req.query;
    try {
        blockhandler = ((ET) => {
            return new Promise((resolve, reject) => {
                const url = `SELECT id, ElectionBlocks FROM electionbodydata WHERE ElectionName = ?`;
                connection.query(url, [ET], (err, result) => {
                    if (err) return reject(err);

                    const blockMap = {};
                    result.forEach(row => {
                        blockMap[row.id] = row.ElectionBlocks;
                    });

                    resolve(blockMap);  // { id1: 'Pratappur', id2: 'Premnagar', ... }
                });
            });
        });


        pollingstations = ((ids) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT PS, ElectionId FROM pollingstations WHERE ElectionId IN (?);`;
            connection.query(sql, [ids], (err, result) => {
                if (err) return reject(err);
                resolve(result); // now includes both PS and ElectionId
                });
            });
        });


        const idsMap = await blockhandler(ET);         // { id: block }
        const ids = Object.keys(idsMap);               // [id1, id2, ...]
        const psList = await pollingstations(ids);     // [{ PS, ElectionId }, ...]

        const psBlockMap = {};
        psList.forEach(({ PS, ElectionId }) => {
            const block = idsMap[ElectionId];
            if (!psBlockMap[block]) psBlockMap[block] = [];
            psBlockMap[block].push(PS);
        });

        const randomise1data = await showdynamicRandData(ET);
        const extraRandomiseData = await showExtraDynamicData(ET);
        const mergedData = mergeRandomisationData(randomise1data, extraRandomiseData, psBlockMap);

        res.status(200).json({
            success: true,
            data: mergedData
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching pre-existing data",
            error: error.message,
        });
    }
});

async function showdynamicRandData(et){
    return new Promise((resolve, reject)=>{
        let block = [];
        connection.query(`SELECT DISTINCT ElectionBlock FROM randomisation1 WHERE ElectionName = ?;`,[et],(err,result)=>{
            if(err) return reject(err);

            block = result.map(val => val.ElectionBlock);

            if (block.length === 0) return resolve([]);

            connection.query(`SELECT ElectionBlock , P0 , P1 , P2 , P3 FROM randomisation1 WHERE ElectionName = ? AND ElectionBlock IN (?)`,[et , block],(err,result)=>{
                if(err) return reject(err);

                resolve(result);
            });
        });
    });
}

async function showExtraDynamicData(et) {
    return new Promise((resolve, reject)=>{
        let block = [];
        connection.query(`SELECT DISTINCT ElectionBlock FROM randomisation5percentextra1 WHERE ElectionName = ?;`,[et],(err,result)=>{
            if(err) return reject(err);

            block = result.map(val => val.ElectionBlock);

            if (block.length === 0) return resolve([]);

            connection.query(`SELECT ElectionBlock , Extra5Percent FROM randomisation5percentextra1 WHERE ElectionName = ? AND ElectionBlock IN (?)`,[et , block],(err,result)=>{
                if(err) return reject(err);

                resolve(result);
            });
        });
    });
}

function mergeRandomisationData(randomise1data, extraRandomiseData, psBlockMap) {
    const extraMap = {};
    extraRandomiseData.forEach(item => {
        extraMap[item.ElectionBlock] = item.Extra5Percent;
    });

    return randomise1data.map(item => ({
        ...item,
        Extra5Percent: extraMap[item.ElectionBlock] || null,
        PS: psBlockMap[item.ElectionBlock] || []
    }));
}


router.delete("/resetrandomisedata",async (req , res)=>{
    const {ET} = req.query;

    try {
        const deletedata = ((ET)=>{
            return new Promise((resolve , reject)=>{
                connection.query(`delete from randomisation1 where ElectionName = ?`,[ET],(err,result)=>{
                    if(err){ 
                        return reject(err);
                    }
                    connection.query(`delete from randomisation2 where ElectionName = ?`,[ET],(err,result)=>{
                    if(err){ 
                        return reject(err);
                    }
                        connection.query(`delete from randomisation3 where ElectionName = ?`,[ET],(err,result)=>{
                            if(err){ 
                                return reject(err);
                            }
                            resolve(true);
                        });
                    });
                });
            });
        });

        const deleteextradata = ((ET)=>{
            return new Promise((resolve , reject)=>{
                connection.query(`delete from randomisation5percentextra1 where ElectionName = ?`,[ET],(err,result)=>{
                    if(err) return reject(err);

                    resolve(true);
                });
            });
        });

        const data = await deletedata(ET);
        const extradata = await deleteextradata(ET);

        if(data){
            res.status(200).json({
                success : true,
            })
        }
    } catch (error) {
        console.error("Database error:", err.message);
        return res.status(500).json({ success: false, message: "Database error" });
    }

});



module.exports = router;