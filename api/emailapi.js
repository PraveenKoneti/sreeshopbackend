const express=require("express");
const router=express.Router();
module.exports =router;

let nodemailer = require('nodemailer');
const multer = require("multer");

 //  krbe qjhk uvxa dfmk   -- password 

 const Email = require("../models/emailschema");

router.post("/sendemail", (req,res)=>{

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
        res.status(200).json({"message":"Error While Sending Email", status:false});
    } else {
        let newemail = Email({
            toemail:req.body.toemail,
            mysubject:req.body.mysubject,                  //  http://localhost:7777/email/sendemail
            mymessage:req.body.mymessage
        })

        res.status(200).json({"message":"Email Send Successfully !", status:true})
    }
    });
})


//-----------------------------------------------------------------------------------------------------------------


                                        // TO SEND A EMAIL FOR ORDER PDF

const Emailpdf = require("../models/emailpdfschema");

// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/sendorderpdf", upload.single("file"), (req, res) => {

    const { toemail, mysubject, mymessage } = req.body;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kr19pravin@gmail.com',
            pass: 'krbe qjhk uvxa dfmk'
        }
    });

    var mailOptions = {
        from: 'kr19pravin@gmail.com',
        to: toemail,
        subject: mysubject,
        text: mymessage,
        attachments: [
            {
                filename: 'invoice.pdf',
                content: req.file.buffer
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(200).json({ "message": "Error While Sending Email" });
        } else {
            let newemail = Emailpdf({
                toemail: toemail,
                mysubject: mysubject,
                mymessage: mymessage
            });
                                                    // http://localhost:7777/emailpdf/sendorderpdf
            //newemail.save()
            //console.log("email send successfully");  
            res.status(200).json({ "message": "Email Sent Successfully!" });     
        }
    });
});                       