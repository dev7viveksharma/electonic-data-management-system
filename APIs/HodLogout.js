const express = require("express");
const path = require("path");
const router = express.Router();

router.get('/logout', (req, res) => {
    res.clearCookie('token'); // clear the auth cookie
    res.redirect('/edms.html');   // redirect to login or home page
  });

  module.exports = router;