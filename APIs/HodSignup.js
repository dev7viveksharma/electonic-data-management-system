const express = require("express");
const bcrypt = require("bcrypt");
const sql = require("mysql2");
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.post("/signup",(req,res)=>{
    let {username , gmail , mobileno, designation , password} = req.body;
    const q = `SELECT * FROM adminsignup where adminMobileNo= ? OR adminEmail = ?`;
    connection.query(q,[mobileno,gmail], async(err,result)=>{
        if (err) {
            console.error('Error checking user existence:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if(result.length >0){
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userid = uuidv4();

            const insertQuery = `
                INSERT INTO adminsignup (adminId, adminName, adminEmail, adminMobileNo, adminDesignation, adminPassword)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            connection.query(insertQuery, [userid, username, gmail, mobileno, designation, hashedPassword], (err, result) => {
                if (err) {
                    console.error('❌ Error inserting user into database:', err);
                    return res.status(500).json({ success: false, message: 'Failed to save user' });
                }

                console.log('✅ User inserted:', result);
                res.status(201).json({ success: true, message: "User created successfully!" });
            });
        } catch (hashErr) {
            console.error('❌ Error hashing password:', hashErr);
            res.status(500).json({ success: false, message: "Internal error" });
        }
    });
});

module.exports = router;