const express = require("express");
const sql = require("mysql2")
const router = express.Router();
const bcrypt = require("bcrypt");

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});
router.get("/calldataForEdit",(req ,res)=>{
    const {code} = req.query;
    connection.query("SELECT * FROM employee_data where Employee_code = ?",[code],(err,result)=>{
        if(err) return err;

        if(result.length === 0){
            return(new Error("something wen wrong please close the edit window and try again later"));
        }

        res.status(200).json({
            success : true,
            data : result
        });
    });
});

router.delete("/deleteProfile",async (req, res) => {
    const { code , userid,  password } = req.query;

    try {
        if (!code && !password && !userid) {
            return res.status(400).json({ success: false, message: "Missing employee code or password." });
        }

        const approved = await matchpassword(password , userid);

        if(approved){
            connection.query(
            "DELETE FROM employee_data WHERE Employee_code = ?",
            [code],
            (err, result) => {
                if (err) {
                    console.error("Error deleting profile:", err);
                    return res.status(500).json({ success: false, message: "Internal server error." });
                }
    
                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: false, message: "Employee not found." });
                }
    
                res.json({ success: true, message: "Employee profile deleted successfully." });
            });
        }
        
    } catch (error) {
        console.error("Login error:", error); 
        res.status(404).json({ success: false, message: error.message });
    }
});

const matchpassword = (password, id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT adminPassword FROM adminsignup WHERE adminId = ?`, [id], async (err, result) => {
            if (err) return reject(err);

            if (result.length === 0) {
                return reject(new Error("User not found."));
            }

            const isMatch = await bcrypt.compare(password, result[0].adminPassword);
            if (!isMatch) {
                return reject(new Error("Password is incorrect"));
            }

            resolve(true);
        });
    });
};


router.post("/editProfilesave", async (req, res) => {
    let {
        adminid, adminpass, code, Fname, Lname, profileImg, Mnumber, password, dob, home_district, gender,
        diffrentlyabled, typeofdisability, disablepercent, certificateofDiability, Designation, typeservice,
        classes, payScale, supervisory, Department, office, Goverment, tec, empStatus, dor, votingexp,
        expcounting, expother, NameVoterList, voterListAssembly, vpn, serialNumber, epic, Acr, Acw,
        currentBasicPay, dcbp, bankName, accountNo, branchCode, ifsc, remarks
    } = req.body;

    try {
        const matched = await matchpassword(adminpass, adminid);

        if (!matched) return res.status(401).json({ success: false, message: "Unauthorized" });

        const employee_Code = code;

        const hashedPassword = await passwordcheck(code , password);

        const includeImage = profileImg && profileImg !== "nochange";
        const includeDisabilityCert = certificateofDiability && certificateofDiability.trim() !== "";

        let query = `UPDATE employee_data SET 
            AdminID = ?, Employee_FName = ?, Employee_LName = ?,
            ${includeImage ? "Employee_Image = ?," : ""}
            Mobile_Number = ?, Employee_Password = ?, Date_of_Birth = ?, Home_District = ?, Gender = ?, 
            Differently_abled = ?,
            ${diffrentlyabled === "yes" ? "Type_of_Disability = ?, Percentage_of_Disability = ?," : ""}
            ${diffrentlyabled === "yes" && includeDisabilityCert ? "Disability_certificate = ?," : ""}
            Designation = ?, Type_of_Service = ?, Class = ?, Pay_Scale = ?, Supervisory = ?, 
            Department = ?, Office = ?, Government = ?, Treasury_Employee_Code = ?, Employee_Status = ?, 
            Date_of_Retirement = ?, Experience_in_Voting_Duties = ?, Experience_in_Counting_Duties = ?, 
            Experience_in_Other_Election_Related_Work = ?, Name_Present_in_Chhattisgarh_Voter_List = ?, 
            Voter_List_Assembly = ?, Voter_Part_Number = ?, Voter_Serial_Number = ?, EPIC_Number = ?, 
            Assembly_Constituency_of_Residence = ?, Assembly_Constituency_of_Workplace = ?, 
            Current_Basic_Pay = ?, Date_of_Current_Basic_Pay = ?, Bank_Name = ?, Account_Number = ?, 
            Branch_Code = ?, IFSC_Code = ?, Remark = ? 
            WHERE Employee_code = ?`;

        let values = [
            adminid, Fname, Lname,
            ...(includeImage ? [profileImg] : []),
            Mnumber, hashedPassword, dob, home_district, gender,
            diffrentlyabled,
            ...(diffrentlyabled === "yes" ? [typeofdisability, disablepercent] : []),
            ...(diffrentlyabled === "yes" && includeDisabilityCert ? [certificateofDiability] : []),
            Designation, typeservice, classes, payScale, supervisory,
            Department, office, Goverment, tec, empStatus,
            dor, votingexp, expcounting, expother, NameVoterList,
            voterListAssembly, vpn, serialNumber, epic, Acr, Acw,
            currentBasicPay, dcbp, bankName, accountNo, branchCode, ifsc, remarks,
            employee_Code
        ];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error('❌ Database error:', err.message);
                return res.status(500).json({ success: false, message: 'Failed to update user' });
            }

            console.log('✅ Profile updated:', result);
            res.status(200).json({ success: true, message: "Profile updated successfully!" });
        });

    } catch (error) {
        console.error("❌ Server error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


const passwordcheck = (id , password) =>{
    return new Promise((resolve , reject)=>{
        connection.query(`select Employee_Password from employee_data where Employee_code = ? `,[id],async(err,result)=>{
            const isSame = await bcrypt.compare(password, result[0].Employee_Password);

            if(isSame){
                resolve(password);
            }else{
                let hashedPassword = await bcrypt.hash(password,10);
                resolve(hashedPassword);
            }

        });
    });
}



module.exports = router;