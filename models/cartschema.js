
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableStructure = new mongoose.Schema({
    userid              : {type: Schema.Types.ObjectId, ref: 'User', required: true},
    productid           : {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    sellerid            : {type: Schema.Types.ObjectId, ref: 'Seller', required: true},
    brandname           : {type:String, required:true},
    categoryname        : {type:String, required:true},
    productname         : {type:String, required:true},
    productprice        : {type:Number, required:true},
    productquantity     : {type:Number, required:true},
    productactive       : {type:String, required:true},
    productimage        : {type:String, required:true, trim: true},
});

module.exports = mongoose.model("Cartlist", tableStructure);