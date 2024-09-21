const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    toemail: {
        type: String,
        required: true,
        trim: true
    },
    mysubject: {
        type: String,
        required: true,
        trim: true
    },
    mymessage: {
        type: String,
        required: true,
        trim: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const Emailpdf = mongoose.model("Emailpdf", emailSchema);

module.exports = Emailpdf;
