const mongoose = require("mongoose");

const tablestructure = new mongoose.Schema({
    email : { type:String,required:true},
    subject:{ type:String,required:true},
    message:{ type:String}
});


module.exports = mongoose.model("Email",tablestructure);