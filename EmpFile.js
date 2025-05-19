const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'/data/profile/');
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()*1E9);
        const ext = path.extname(file.originalname);
        cb(null,file.fieldname + '-'+uniqueSuffix+ext);
    }
});

const upload = multer({storage:storage});

router.post('/uploadImg',upload.single('pimage'),(req,res)=>{
    if(!req.file){
        return res.status(400).json({error:'no file uploaded'});
    }

    res.json({
        message:'image uploaded successfully',
        path:`/profile/${req.file.filename}`
    });
});

module.exports = router;