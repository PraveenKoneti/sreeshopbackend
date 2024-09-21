
const express = require("express");
const router = express.Router();
module.exports = router;

const config = require('../config')

const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens


                //      To import the sellerschema  

const Seller = require("../models/sellerschema");





                //      To Check that Seller mail and mobile number are existed or not in Database


router.post("/checkseller", async(req, res)=>{
    let value = req.body.value;
    let checkvalue;
    if( typeof(value) === 'number')
        checkvalue = await Seller.findOne({mobile:value});      // http://localhost:7777/seller/checkseller      
    else
        checkvalue = await Seller.findOne({email:value});

    if(checkvalue)
        res.status(200).json([checkvalue]);
    else
        res.status(200).json([])
})





                //    To Check Email and Password for Login Purpose 

router.post("/sellerlogin", async(req, res)=>{

        let email = req.body.email;
        let password = req.body.password;
        let existingUser = await Seller.findOne( {email:email});

        if (!existingUser) 
            return res.status(200).json({ message: 'Invalid email or password', status:false });

        const isMatch = await bcrypt.compare(password, existingUser.password);
        
        if (!isMatch) 
            return res.status(200).json({ message: 'Invalid email or password', status:false });
        
        const token = jwt.sign({ user: existingUser}, config.secretKey, {expiresIn: '1h'});

        console.log(existingUser);
        if(existingUser)
            res.status(200).json( {existingUser, token, status:true});          // http://localhost:7777/seller/sellerlogin
        else
            res.status(200).json([]);
});




                //    To get the particular Seller Details 

router.post("/sellerdetails", async(req, res)=>{
    let id = req.body.id;
    let userdetails = await Seller.findById(id);          // http://localhost:7777/seller/sellerdetails
    if(userdetails)
        res.status(200).json(userdetails);
    else 
        res.status(200).json({"msg" : "There is nothing any data"});
});




                //      To Save the seller Details 

router.post("/saveseller", async(req, res)=>{

    let password = req.body.password;
    const salt = await bcrypt.genSalt(10); // Add salt rounds for security
    const hashedPassword = await bcrypt.hash(password, salt);

    let newuser = Seller({
        firstname : req.body.firstname,
        lastname  : req.body.lastname,
        mobile    : req.body.mobile,           //    http://localhost:7777/seller/saveseller
        email     : req.body.email,
        gender    : req.body.gender,
        password  : hashedPassword,
    });

    await newuser.save();
    res.status(200).json({ "message" : req.body.firstname +" "+ req.body.lastname })
});