const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const router = express.Router();

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'edms',
    password:'123414'
});

module.exports = router;