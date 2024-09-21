const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");


const Emailpdf = require("../models/emailpdfschema");

// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/sendemailpdf", upload.single("pdf"), (req, res) => {

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
                                                            // http://localhost:7777/emailpdf/sendemailpdf
            //newemail.save()
            //console.log("email send successfully");  
            res.status(200).json({ "message": "Email Sent Successfully!" });     
        }
    });
});

module.exports = router;
