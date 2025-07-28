const express = require("express");
const sql = require("mysql2")
const router = express.Router();

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
    })
})

module.exports = router;