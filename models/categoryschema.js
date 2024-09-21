
const mongoose = require("mongoose");

const tableStructure = new mongoose.Schema({

    categoryname : {type:String, required:true},

});

module.exports = mongoose.model("Category", tableStructure);