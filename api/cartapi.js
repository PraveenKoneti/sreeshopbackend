
const express=require("express");
const router=express.Router();
module.exports = router;

const jwt = require('jsonwebtoken');
const config = require('../config');


                        //   REQUIRE TO CART SCHEMA
                        
const Cartlist = require("../models/cartschema");



                        //    TO RETRIVE THE CARTLIST DATA 

router.get("/getcartlist", async(req, res)=>{
    
    const token = (req.headers['authorization'] || '').split(' ')[1];

    jwt.verify(token, config.secretKey, async (err, decoded) => {
        if (err) {
            // Handle verification error
            return res.status(200).json({ message: "Authentication Failed/Session Expired!", status: false });
        }

        const cartlistdata = await Cartlist.find({ userid: req.query.id});

        // Send the response with cart list data
        return res.status(200).json({ items: cartlistdata, status: true });
    });
});


//-----------------------------------------------------------------------------------------------------------------


                        //     TO SAVE THE PRODUCTS IN CARTLIST 

router.post("/savecartlist", async(req, res)=>{
    let id = req.body.productid;
    let productdata = await Cartlist.findOne( {productid : id} );
    if(productdata)
        res.status(200).json( {"message" : "no"} );
    else
    {
        let newcartlist = Cartlist({
            userid              :  req.body.userid,
            productid           :  req.body.productid,
            sellerid            :  req.body.sellerid,
            brandname           :  req.body.brandname,
            categoryname        :  req.body.categoryname,
            productname         :  req.body.productname,        // http://localhost:7777/cartlist/savecartlist
            productprice        :  req.body.productprice,
            productquantity     :  req.body.productquantity,
            productactive       :  req.body.productactive,
            productimage        :  req.body.productimage
        });
        
        await newcartlist.save();
        res.status(200).json( {"message" : "yes"} );
    }
});



                    //   TO UPDATE  THE PARTICULAR PRODUCT DATA IN CARTLIST

router.put("/updatecartlist/:id", async(req, res)=>{
        let id = req.params.id;
        let updatecartdata = await Cartlist.findById(id);
            console.log(updatecartdata);
            updatecartdata.productquantity = req.body.productquantity;    // http://localhost:7777/cartlist/updatecartlist
            await updatecartdata.save();
            res.status(200).json( {"message" : "Quantity Updated Sucessfully"} )
});



                //   TO DELETE THE PARTICULAR PRODUCT DATA FROM CARTLIST 

router.delete("/deletecartlist/:id", async(req, res)=>{
    let id = req.params.id;
    let cartlistdata = await Cartlist.findById(id);
        await cartlistdata.deleteOne();
        res.status(200).json( {"message" : "Deleted Successfully"} );
})
                    
