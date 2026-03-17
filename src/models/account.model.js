const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountNumber:{
        type: String,
        required: true,
        unique: true,
    },
    accountType:{
           type: String,
           enum:["Savings", "Current"],
           default:"Savings"
    },
    balance: {
        type: Number,
        default:0,
    }
},{
    timestamps: true
});

module.exports = new mongoose.model("Account",accountSchema);