const express = require("express");
const router = express.Router();
module.exports = router;


const Wishlist = require("../models/wishlistschema");



                    //       TO GET THE WISHLIST DATA 

router.get("/getwishlist", async(req, res)=>{
    let id = req.query.id;
    let wishlistdata = await Wishlist.find( {userid : id})      // http://localhost:7777/wishlist/getwishlist
    res.status(200).json(wishlistdata);
});



                    //        TO SAVE THE PRODUCT IN WISHLIST

router.post("/savewishlist", async(req, res)=>{
    let newwishlist = Wishlist({
        userid              :  req.body.userid,
        productid           :  req.body.productid,
        sellerid            :  req.body.sellerid,
        brandname           :  req.body.brandname,
        categoryname        :  req.body.categoryname,
        productname         :  req.body.productname,          // http://localhost:7777/wishlist/savewishlist
        productprice        :  req.body.productprice,
        productactive       :  req.body.productactive,
        productimage        :  req.body.productimage
    });

    await newwishlist.save();
    res.status(200).json( {"message" : "Saved Successfully in Wishlist"} );
});



                //        TO DELETE THE PARTICULAR PRODUCT IN WISHLIST 

router.delete("/deletewishlist/:id", async(req, res)=>{
    let id = req.params.id;
    let wishlistdata = await Wishlist.findById(id);          //  http://localhost:7777/wishlist/deletewishlist
    await wishlistdata.deleteOne();
    res.status(200).json( {"message" : "Removed Successfully from Wishlist"} )
})