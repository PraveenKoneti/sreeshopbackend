const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tablestructure = new mongoose.Schema({
    userid         : {type: Schema.Types.ObjectId, ref: 'User', required: true},
    name           : { type:String,required:true},
    mobile         : { type:Number, required:true},
    email          : { type:String, required:true},
    address        : { type:String, required:true},
    totalamount    : { type:Number, required:true},
    orderstatus    : { type:String, required:true},
    paymentmethod  : { type:String, required:true},
    date           : { type:String, required:true},
    products       : { type:Object, required:true}

    
});

module.exports = mongoose.model("Orderlist",tablestructure);