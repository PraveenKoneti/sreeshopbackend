
const express = require("express");
const router = express.Router();
module.exports = router;
const moment = require('moment');

let Orderlist = require("../models/orderschema");



                    //       TO GET THE Oderlist DATA 

router.get("/getorderlist", async(req, res)=>{
    let id = req.query.id;
    let orders = await Orderlist.find( {userid:id} );    //  http://localhost:7777/orderlist/getorderlist 
    res.status(200).json(orders);
});



                    //  TO SAVE THE ORDERLIST DATA 
                    
router.post("/saveorder", async(req, res)=>{
    const currentDate = moment().utc().toDate()
    let neworder = Orderlist({
        userid         : req.body.id,
        name           : req.body.name,
        mobile         : req.body.mobile,
        email          : req.body.email,
        address        : req.body.address,
        totalamount    : req.body.totalamount,
        paymentmethod  : req.body.paymentmethod,
        orderstatus    : req.body.orderstatus,
        date           : currentDate.toISOString(),
        products       : req.body.itemslist
    })
                                                            //  http://localhost:7777/orderlist/saveorder 
    const savedOrder = await neworder.save();
    res.status(200).json({ message: "true", orderId: savedOrder._id });
})


//----------------------------------------------------------------------------------------------------------------

                //  TO GET THE PARTICULAR PRODUCTS IS RELATED TO THE PARTICULAR SELLER PRODUCTS 

router.get("/getsellerorders", async(req, res)=>{
    let sellerid = req.query.sellerid;
    let orders = await Orderlist.find( {"products.sellerid" : sellerid} ) // http://localhost:7777/orderlist/getsellerorders 
    res.status(200).json(orders);
})

//-----------------------------------------------------------------------------------------------------------------


                // TO CANCEL THE ORDER THAT PARTICULAR ITEM ORDER 

router.post("/cancelorder", async(req, res)=>{
    let id = req.body.id;
    let order = await Orderlist.findById(id);
        order.orderstatus = "cancelled";
        await order.save();                               // http://localhost:7777/orderlist/cancelorder 
        res.status(200).json( {"message":"Cancelled Successfully"} );
})



//-----------------------------------------------------------------------------------------------------------------
 

        