
const mongoose = require("mongoose");

const tableStructure = new mongoose.Schema({
    firstname : { type:String, required:true},
    lastname  : { type:String, required:true},
    mobile    : { type:Number, required:true, unique:true},
    email     : { type:String, required:true, unique:true},
    gender    : { type:String, required:true},
    password  : { type:String, required:true}   
})

module.exports = mongoose.model("Seller", tableStructure);