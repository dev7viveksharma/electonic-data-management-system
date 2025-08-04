const express = require("express");
const sql = require("mysql2")
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt= require("bcrypt");

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: "viveklvs123@gmail.com",
    pass: "popcunbtxlbjbqgy", // Not your Gmail password — use App Password or OAuth
    },
  });


router.get('/Resetpassword', (req, res) => {
  const token = req.query.token;
  res.sendFile(path.join(__dirname , '../views/Resetpassword.html'));
});

router.get("/sendEmail", async (req, res) => {
  const { identifier } = req.query;

  try {
    const mail = await findemail(identifier);
    const hodid = await findid(mail);
    const otp = await otpgeneration();
    const expiryMinutes = 5;
    const expiryDate = new Date(Date.now() + 5 * 60 * 1000);

    // Delete any existing OTP
    const deleteQuery = `DELETE FROM otp WHERE HODid = ? OR email = ?`;
    connection.query(deleteQuery, [hodid, mail], (delErr) => {
      if (delErr) console.warn("Old OTP cleanup failed:", delErr);
    });

    // Insert new OTP record
    const insertQuery = `INSERT INTO otp (HODid, email, otp, expiry,expires_at) VALUES (? , ? , ? , ? , ?)`;
    connection.query(insertQuery, [hodid, mail, otp, expiryMinutes,expiryDate], async (insertErr) => {
      if (insertErr) {
        console.error("DB Insertion Error:", insertErr);
        return res.status(500).json({ success: false, message: "OTP could not be saved." });
      }

      // Send the OTP email only after insert succeeds
      const mailOptions = {
        from: "viveklvs123@gmail.com",
        to: mail,
        subject: "EDMS: Your OTP Code",
        html: `<h2>Your OTP Code is <b>${otp}</b></h2><p>It will expire in 5 minutes.</p>`,
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
          success: true,
          message: "OTP sent successfully",
          email : mail
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP email.",
        });
      }
    });

  } catch (error) {
    console.error("Error in /sendEmail:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


async function otpgeneration(){
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

}

const findemail = (identifier) => {
  return new Promise((resolve , reject)=>{
    const url = identifier.includes("@")?`select adminEmail from adminsignup where adminEmail = ?`:`select adminEmail from adminsignup where adminMobileNo = ?`;
    connection.query(url,[identifier],(err,result)=>{
      if (err) {
        return reject(new Error("Database error occurred"));
      }
      if(result.length === 0){
        return reject(new Error(`this Email or Number is not Associated with any Account`));
      }

      resolve(result[0].adminEmail);
    });
  });
}

const findid = (identifier) => {
  return new Promise((resolve , reject)=>{
    const url = `select adminId from adminsignup where adminEmail = ?`;
    connection.query(url,[identifier],(err,result)=>{
      if (err) {
        return reject(new Error("Database error occurred"));
      }
      if(result.length === 0){
        return reject(new Error(`something went wrong`));
      }

      resolve(result[0].adminId);
    });
  });
}


router.get("/verifyotp",async (req ,res)=>{
  const {email , otp }  = req.query;
    try {
      const isvalid = await verifyotp(email , otp);

      if(isvalid){
        res.status(200).json({ success: true, message: "OTP verified!" , email : email });
      }
    } catch (error) {
       console.error("Error in /verifyotp:", error.message);
            res.status(400).json({
                success: false,
                message: error.message,
            });
    }
});

const verifyotp = (email , otp ) =>{
  return new Promise((resolve , reject)=>{
    const url = `select * from otp where otp = ? and email = ?`;
    connection.query(url,[otp , email],(err,result)=>{
      if (err) {
        return reject(new Error("Database error occurred"));
      }
      if(result.length === 0){
        return reject(new Error(`invalid otp`));
      }

      const record = result[0];
      const createdAt = new Date(record.created_at);
      const now = new Date();
      const minutesPassed = (now - createdAt) / (1000 * 60); // milliseconds to minutes

      if (minutesPassed > record.expiry) {
        return reject(new Error("OTP expired"));
      }

      return resolve(true);
    });
  });
}


router.post("/insertnewpassword",async(req,res)=>{
  const {password , email} = req.body;
  try {
    const hashedpassword = await bcrypt.hash(password,10);
    connection.query(`UPDATE adminsignup SET adminPassword = ? WHERE adminEmail = ?`,[hashedpassword , email],(err,result)=>{
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.status(200).json({ success: true, message: "Password updated successfully" });
    });
  } catch (error) {
     console.error("Error in /insertnewpassword:", error.message);
      return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
})
module.exports = router;