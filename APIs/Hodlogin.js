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

router.post("/login",(req,res)=>{
    let { identified, password } = req.body;
    try {
        console.log("Request received:", req.body); // Debugging: Check incoming data

        const isEmail = identified.includes("@");
        let query = isEmail
            ? "SELECT * FROM adminsignup WHERE adminEmail = ? "
            : "SELECT * FROM adminsignup WHERE adminMobileNo = ?";

        // Execute the query and get the rows
        connection.query(query, [identified], async (err, rows) => {
            if (err) {
                console.error("Database query error:", err); // Debugging: Log query errors
                return res.status(500).json({ success: false, message: "Database error" });
            }
            if (rows.length === 0) {
                return res.status(401).json({ success: false, message: "User not found" });
            }
            const user = rows[0]; // Assuming there's only one result
            const match = await bcrypt.compare(password, user.adminPassword);
            if (!match) {
                return res.status(401).json({ success: false, message: "Incorrect password" });
            }

            if(rows[0].status === `Block`){
                return res.status(200).json({success : true ,  status : rows[0].status , message : `Access denied. ${rows[0].adminName} is blocked By the Authority`})
            }

            res.json({ success: true, message: "Login successful", status : rows[0].status , userid: user.adminId, username: user.adminName  , AdminDesignation: user.adminDesignation});
        });

    } catch (err) {
        console.error("Login error:", err); // Debugging: Log errors during the try block
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;