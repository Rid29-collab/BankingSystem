const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required for creating user"],
        trim: true,
        lowercase: true,
        match: [ /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill a valid email address.',
        ],
        unique:[true,"Email already exists."]
    },
    name:{
        type: String,
        required: [true, "Name is required"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        match: [
             /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
            'Password must be 8-16 characters and include uppercase, lowercase, number and special character',
        ],
        select: false,
    }
}, {
    timestamps: true  // display user when create and where it was upated.
})

//userSchema.pre("save",async function(next)  when use async middleware, Mongoose does not require next()
userSchema.pre("save",async function(){
    if(!this.isModified('password')){
        return;
    }

    const hash = await bcrypt.hash(this.password,10)
    this.password = hash    
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;