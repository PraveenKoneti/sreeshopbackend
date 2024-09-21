
const mongoose = require("mongoose");

const tableStructure = new mongoose.Schema({

    brandname    : {type:String, required:true},
});

module.exports = mongoose.model("Brand", tableStructure);