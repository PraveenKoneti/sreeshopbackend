
const express = require("express");
const router = express.Router();
module.exports = router;

const config = require('../config')

const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens


                //      To import the userschema  

const User = require("../models/userschema");

//----------------------------------------------------------------------------------------------------------------


                //      To Check that User mail and mobile number are existed or not in Database


router.post("/checkuser", async(req, res)=>{
    let value = req.body.value;
    let checkvalue;
    if( typeof(value) === 'number')
        checkvalue = await User.findOne({mobile:value});      // http://localhost:7777/user/checkuser      
    else
        checkvalue = await User.findOne({email:value});

    if(checkvalue)
        res.status(200).json([checkvalue]);
    else
        res.status(200).json([])
})


//---------------------------------------------------------------------------------------------------------------------

                //    To Check Email and Password for Login Purpose 

router.post("/userlogin", async(req, res)=>{
    
        let email = req.body.email;
        let password = req.body.password;
        let existingUser = await User.findOne( {email:email} );
        
        if (!existingUser) 
            return res.status(200).json({ message: 'Invalid email or password', status:false });

        const isMatch = await bcrypt.compare(password, existingUser.password);
        
        if (!isMatch) 
            return res.status(200).json({ message: 'Invalid email or password', status:false });
        
        const token = jwt.sign({ user: existingUser}, config.secretKey, {expiresIn: '1h'});
        
        res.status(200).json( {token, existingUser, status:true} );          // http://localhost:7777/user/userlogin
});


//-----------------------------------------------------------------------------------------------------------------

                //    To get the particular user Details 

router.get("/userdetails", async(req, res)=>{
    let id = req.query.id;
    let userdetails = await User.findById(id);          // http://localhost:7777/user/userdetails
    if(userdetails)
        res.status(200).json(userdetails);
    else 
        res.status(200).json({"msg" : "There is nothing any data"});
});


//------------------------------------------------------------------------------------------------------------------


                //      To Save the User Details 

router.post("/saveuser", async(req, res)=>{

    let password = req.body.password;
    const salt = await bcrypt.genSalt(10); // Add salt rounds for security
    const hashedPassword = await bcrypt.hash(password, salt);

    let newuser = User({
        firstname : req.body.firstname,
        lastname  : req.body.lastname,
        mobile    : req.body.mobile,           //    http://localhost:7777/user/saveuser
        email     : req.body.email,
        gender    : req.body.gender,
        password  : hashedPassword,
    });

    

    await newuser.save();
    res.status(200).json({ "message" : req.body.firstname +" "+ req.body.lastname })
});


//-----------------------------------------------------------------------------------------------------------------


                //    To Update the user Details 

router.post("/updateuser/:id", async(req, res)=>{
    let id = req.params.id;
    let updateuser = await User.findById(id);
        updateuser.firstname = req.body.firstname;
        updateuser.lastname = req.body.lastname;
        updateuser.mobile = req.body.mobile;
        updateuser.email = req.body.email;                    //   http://localhost:7777/user/updateuser
        updateuser.gender = req.body.gender;
        updateuser.password = req.body.password;

    await updateuser.save();
    res.status(200).json( {"message" : req.body.firstname + " " + req.body.lastname} );

})

//------------------------------------------------------------------------------------------------------------------