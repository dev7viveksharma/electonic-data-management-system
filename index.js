const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const {v4:uuidv4} = require("uuid");
const port = 8080;
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const logout_routes = require("./admindashboard");
const profileImages = require("./EmpFile");
const createEmployee = require("./Employeesignup");
const diableCertificate = require("./disabledcertificate");
const ViewEmployee = require("./APIs/Viewdata");
const varifyemp = require("./APIs/varifyemp");
const adminview = require("./APIs/adminData");
const empdatashow = require("./APIs/EmpviewData");
const dmlogin = require("./APIs/DmLogin");
const dmdata = require("./APIs/DMData.js");
const phase1 = require("./APIs/phase1");
const phase2 = require("./APIs/phase2");
const post = require("./APIs/post");
const Randomization = require("./APIs/randomization");
const Randomization2 = require("./APIs/Randomisation2");
const Randomization3 = require("./APIs/Randomisation3.js");
const editProfile = require("./APIs/EditEmployee.js");
const empcountdata = require("./APIs/homepagedata.js");
const { Certificate } = require("crypto");
app.use('/profile', express.static(path.join(__dirname, 'data/profile')));
app.use('/documents',express.static(path.join(__dirname,'data/documents')));
app.use('/PostFiles',express.static(path.join(__dirname, 'data/PostFiles')));
app.use('/Assets', express.static('Assets'));
app.use(cors({
    origin:'http://localhost:8080'
}));

app.get("/Home", (req, res) => {
    res.sendFile(path.join(__dirname, 'views/CollectorDashboard.html'));
});

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

connection.connect(err =>{
    if(err){
        console.error('Error connecting to MySQL:',err);
    }
    console.log("connected to mysql database");
});
app.post("/signup",(req,res)=>{
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


app.post("/login",(req,res)=>{
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



app.use("/",logout_routes);
app.use("/",profileImages);
app.use("/",diableCertificate);
app.use("/",createEmployee);
app.use("/",ViewEmployee);
app.use("/",varifyemp);
app.use("/",adminview);
app.use("/",empdatashow);
app.use("/",dmlogin);
app.use("/",dmdata);
app.use("/",phase1);
app.use("/",phase2);
app.use("/",post);
app.use("/",Randomization);
app.use("/",Randomization2);
app.use("/",Randomization3);
app.use("/",editProfile);
app.use("/",empcountdata);
app.get("/:htmlFile", (req, res) => {
    const fileName = req.params.htmlFile;

    // Ensure only .html files are allowed
    if (!fileName.endsWith(".html")) {
        return res.status(400).send("Only .html files are allowed.");
    }

    const filePath = path.join(__dirname, "views", fileName);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send("Page not found.");
        }
    });
});
app.listen(port,(req,res)=>{
    console.log("server has been started");
});