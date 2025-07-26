const express = require("express");
const sql = require("mysql2")
const router = express.Router();

const connection = sql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});


module.exports = router;