const express = require("express");
const mysql = require("mysql2");
const {v4:uuidv4} = require("uuid");
const bcrypt= require("bcrypt");
const path = require("path");
const router = express.Router();

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});


function codegenrator(){
    return Math.floor(Math.random()*90000)+10000;
}

function queryPromise(connection,sql,params){
    return new Promise((resolve, reject)=>{
        connection.query(sql,params,(err,results)=>{
           if (err) reject(err);
           else resolve(results);
        });
    });
}
async function checkcode(){
    while(true){
        const code = codegenrator();
        const results = await queryPromise(connection,`SELECT COUNT(*) AS count FROM employee_data WHERE Employee_code = ? `,[code]);
        
        if(results[0].count === 0){
            return code;
        }
    }
    
}

router.post("/CreateEmployeeAccount",(req,res)=>{
    let {adminid , Fname , Lname , profileImg , Mnumber , password , dob , home_district , gender , diffrentlyabled , typeofdisability , disablepercent , certificateofDiability , Designation , typeservice , classes , payScale , supervisory , Department , office , Goverment , tec , empStatus , dor , votingexp , expcounting , expother , NameVoterList , voterListAssembly ,vpn, serialNumber , epic , Acr , Acw , currentBasicPay , dcbp , bankName , accountNo , branchCode , ifsc , remarks }= req.body;
    const q = `SELECT * FROM employee_data where Mobile_Number = ? AND  Designation = ? `;

    connection.query(q,[Mnumber,Designation],async(err,result)=>{
        if (err){
            console.error('Error checking user existence:', err);
            return res.status(500).json({ success: false, message: 'Database error'});
        }
        if(result.length >0){
            return res.status(400).json({ success: false, message: "User already exists"});
        }

        try{
            let employee_Code = await checkcode();
            let hashedPassword = await bcrypt.hash(password,10);
            let query = diffrentlyabled === "yes" ? `INSERT INTO employee_data(AdminID , Employee_code , Employee_FName , Employee_LName , Employee_Image , Mobile_Number , Employee_Password , Date_of_Birth , Home_District , Gender , Differently_abled , Type_of_Disability ,Percentage_of_Disability , Disability_certificate , Designation , Type_of_Service , Class , Pay_Scale , Supervisory , Department , Office , Government , Treasury_Employee_Code , Employee_Status , Date_of_Retirement , Experience_in_Voting_Duties , Experience_in_Counting_Duties , Experience_in_Other_Election_Related_Work , Name_Present_in_Chhattisgarh_Voter_List , Voter_List_Assembly , Voter_Part_Number ,Voter_Serial_Number , EPIC_Number , Assembly_Constituency_of_Residence , Assembly_Constituency_of_Workplace , Current_Basic_Pay , Date_of_Current_Basic_Pay , Bank_Name , Account_Number , Branch_Code , IFSC_Code , Remark)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
                                                  : `INSERT INTO employee_data(AdminID , Employee_code , Employee_FName , Employee_LName , Employee_Image , Mobile_Number , Employee_Password , Date_of_Birth , Home_District , Gender , Differently_abled , Designation , Type_of_Service , Class , Pay_Scale , Supervisory , Department , Office , Government , Treasury_Employee_Code , Employee_Status , Date_of_Retirement , Experience_in_Voting_Duties , Experience_in_Counting_Duties , Experience_in_Other_Election_Related_Work , Name_Present_in_Chhattisgarh_Voter_List , Voter_List_Assembly , Voter_Part_Number ,Voter_Serial_Number , EPIC_Number , Assembly_Constituency_of_Residence , Assembly_Constituency_of_Workplace , Current_Basic_Pay , Date_of_Current_Basic_Pay , Bank_Name , Account_Number , Branch_Code , IFSC_Code , Remark)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let values = diffrentlyabled === "yes" 
            ?[adminid,employee_Code,Fname,Lname,profileImg,Mnumber,hashedPassword,dob,home_district,gender,diffrentlyabled,typeofdisability,disablepercent,certificateofDiability,Designation,typeservice,classes,payScale,supervisory,Department,office,Goverment,tec,empStatus,dor,votingexp,expcounting,expother,NameVoterList,voterListAssembly,vpn,serialNumber,epic,Acr,Acw,currentBasicPay,dcbp,bankName,accountNo,branchCode,ifsc,remarks]
            :[adminid,employee_Code,Fname,Lname,profileImg,Mnumber,hashedPassword,dob,home_district,gender,diffrentlyabled,Designation,typeservice,classes,payScale,supervisory,Department,office,Goverment,tec,empStatus,dor,votingexp,expcounting,expother,NameVoterList,voterListAssembly,vpn,serialNumber,epic,Acr,Acw,currentBasicPay,dcbp,bankName,accountNo,branchCode,ifsc,remarks];

            connection.query(query,values,(err,result)=>{
                if (err) {
                    console.error('❌ Error inserting user into database:');
                    console.error('❌ Database error:', err.message, err.stack);
                    return res.status(500).json({ success: false, message: 'Failed to save user' });
                }

                console.log('✅ User inserted:', result);
                res.status(201).json({ success: true, message: "User created successfully!" });
            });
        }catch(hashErr){
            console.error('❌ Error hashing password:', hashErr);
            res.status(500).json({ success: false, message: "Internal error" });
        }
    });                                     
});


module.exports = router;