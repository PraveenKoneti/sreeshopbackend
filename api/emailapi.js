const express=require("express");
const router=express.Router();
module.exports =router;

 //  krbe qjhk uvxa dfmk   -- password 

 const Email = require("../models/emailschema");

router.post("/sendemail", (req,res)=>{
    
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kr19pravin@gmail.com',
        pass: 'krbe qjhk uvxa dfmk'
    }
    });

    var mailOptions = {
    from: 'kr19pravin@gmail.com',
    to: req.body.toemail,
    subject: req.body.mysubject,
    text: req.body.mymessage
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        res.status(200).json({"message":"Error While Sending Email"});
    } else {
        let newemail = Email({
            toemail:req.body.toemail,
            mysubject:req.body.mysubject,                  //  http://localhost:7777/email/sendemail
            mymessage:req.body.mymessage
        })

        res.status(200).json({"message":"Email Send Successfully !"})
    }
    });
})