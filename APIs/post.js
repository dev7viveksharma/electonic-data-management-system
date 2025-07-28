const express = require("express");
const sql = require("mysql2")
const router = express.Router();
const multer = require('multer');
const path = require("path");

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

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./data/PostFiles');
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()*1E9);
        const ext = path.extname(file.originalname);
        cb(null,file.fieldname + '-'+uniqueSuffix+ext);
    }
});

const upload = multer({storage:storage});

router.post("/uploadPostfile", upload.single("postFile"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }
    console.log(req.file.filename);
    const filePath = `/PostFiles/${req.file.filename}`;  // Relative to public folder

    res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        filePath: filePath
    });
});


router.post("/Uploadpost", async (req, res) => {
    try {
        let { id, type, hod , priority, message, file } = req.body;

        if (!id || !type || !priority) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if(!message){
            message = 'None'
        }

        if(!hod || type === "All"){
            hod = 'None';
        }
        if(!file){
            file = 'None';
        }

        // Step 2: Insert into Posts table
        const sql = `
            INSERT INTO Posts (Dmid, PostType, Hod, Priority, message, File, sent_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const values = [id, type, hod, priority, message, file || ""];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error("DB Insert Error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            return res.status(200).json({ success: true, message: "Post sent successfully." });
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/FetchPosts",async(req,res)=>{
    const {value , hodname} = req.query;
    try {
        const data = await dmid(value , hodname);
        const name = await dmname(data);
        const nameMap = new Map();
        name.forEach(([id, name]) => {
            nameMap.set(id, name);
        });
        const url = hodname !== 'none' ? 
            `SELECT * FROM posts WHERE PostType = ? AND Hod = ?` : 
            `SELECT * FROM posts WHERE PostType = ?`;
        const params = hodname !== 'none' ? [value, hodname] : [value];

        connection.query(url, params,(err,posts)=>{
             if (err) {
                console.error("Error fetching posts:", err);
                return res.status(500).json({ error: "Database error" });
            }

            // Enrich each post with Name from the nameMap
            const finalPosts = posts.map(post => ({
                ...post,
                Name: nameMap.get(post.Dmid) || "Unknown"
            }));

            res.status(200).json({
                success : true,
                finalPosts
            });
        });
    } catch (error) {
        console.error("Error in FetchPublicPosts:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const dmid = (value , h) => {
    return new Promise((resolve , reject )=>{
        const url = h !== 'none' ? `select * from posts where PostType = ? and Hod = ?` : `select * from posts where PostType = ?`;
        const params = h !== 'none' ? [value, h] : [value];

        connection.query(url, params, (err , result)=>{
            if(err){
                return reject(err);
            }
            const dm = result.map(val => val.Dmid);
            resolve(dm);
        });
    });
};


const dmname = (id) =>{
     return new Promise((resolve , reject )=>{
        connection.query(`select Id , Name from collector where Id in (?) `,[id],(err , result)=>{
            if(err){
                return reject(err);
            }
            const info = result.map(val => [val.Id , val.Name]);

            resolve(info);
        });
    })
}


module.exports = router;