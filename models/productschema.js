
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableStructure = new mongoose.Schema({
    sellerid            : {type: Schema.Types.ObjectId, ref: 'Seller', required: true},
    brandname           : {type:String, required:true},
    categoryname        : {type:String, required:true},
    productname         : {type:String, required:true},
    productprice        : {type:Number, required:true},
    productactive       : {type:String, required:true},
    productdate         : {type:String, required:true},
    productimage        : {type:String, required:true, trim: true},
    producturl          : {type:String, required:true},
    productdescription  : {type:String, required:true}
});

module.exports = mongoose.model("Product", tableStructure);