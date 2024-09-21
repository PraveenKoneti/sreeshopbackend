
const express = require("express");
const router = express.Router();
module.exports = router;



                         //      To import the Brandschema 
                         
const Brand = require("../models/brandschema");



                        //     To get the Brand Details 

router.get("/getbrands", async(req, res)=>{
    let brands  =  await Brand.find();               // http://localhost:7777/brand/getbrands
    res.status(200).json(brands);
});



                        //      To Save the Brand details 

router.post("/savebrand", async(req, res)=>{
    let brandname = req.body.brandname;
    let checkbrand = await Brand.findOne( {brandname : brandname} ) 
    if(checkbrand)                                          
        res.status(200).json( {"message" : "Saved Successfully" } )
    else
    {                                                   //   http://localhost:7777/brand/savebrand
       let newbrand = Brand({
            brandname : brandname
       })

       await newbrand.save();
        res.status(200).json( {"message" : "Saved Successfully" } );
    }
    
});
