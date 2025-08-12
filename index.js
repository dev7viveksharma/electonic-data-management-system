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
const HodLogin = require("./APIs/Hodlogin.js");
const Hodsignup = require("./APIs/HodSignup.js"); 
const logout_routes = require("./APIs/HodLogout.js");
const profileImages = require("./APIs/EmpFile.js");
const createEmployee = require("./APIs/Employeesignup.js");
const diableCertificate = require("./APIs/disabledcertificate.js");
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
const resetpassword = require("./APIs/Resetpassword.js");
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


app.use("/",HodLogin);
app.use("/",Hodsignup);
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
app.use("/",resetpassword);
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