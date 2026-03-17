const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["deposit","withdraw","transfer"]
        
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Transaction", transactionSchema);