
const express = require("express");
const router = express.Router();
module.exports = router;



                         //      To import the Categoryschema 
                         
const Category = require("../models/categoryschema");


                         //     To get the Category Details 

router.get("/getcategories", async(req, res)=>{
    let Categories  =  await Category.find();               // http://localhost:7777/category/getcategories
    res.status(200).json(Categories);
});



                        //      To Save the Category details 

router.post("/savecategory", async(req, res)=>{
    let categoryname = req.body.categoryname;
    let checkcategory = await Category.findOne( {categoryname : categoryname} ) 
    if(checkcategory)                                          
        res.status(200).json( {"message" : "Saved Successfully" } );
    else
    {                                                   //   http://localhost:7777/category/savecategory
       let newcategory = Category({
            categoryname : categoryname
       })

       await newcategory.save();
        res.status(200).json( {"message" : "Saved Successfully" } );
    }
    
});
