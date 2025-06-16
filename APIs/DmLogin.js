const express = require("express");
const sql = require("mysql2")
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

router.post("/Dmlogin",(req,res)=>{
    let { identifier, password } = req.body;
    try {
        console.log("Request received:", req.body); // Debugging: Check incoming data

        const isEmail = identifier.includes("@");
        let query = isEmail
            ? "SELECT * FROM collector WHERE Email = ?"
            : "SELECT * FROM collector WHERE MobileNumber = ?";

        // Execute the query and get the rows
        connection.query(query, [identifier], (err, rows) => {
            if (err) {
                console.error("Database query error:", err); // Debugging: Log query errors
                return res.status(500).json({ success: false, message: "Database error" });
            }
            if (rows.length === 0) {
                return res.status(401).json({ success: false, message: "User not found" });
            }
            const user = rows[0]; // Assuming there's only one result
            const match = password === user.Password;
            if (!match) {
                return res.status(401).json({ success: false, message: "Incorrect password" });
            }

            res.json({ success: true, message: "Login successful", Id: user.Id, Name: user.Name  , District: user.District});
        });

    } catch (err) {
        console.error("Login error:", err); // Debugging: Log errors during the try block
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;