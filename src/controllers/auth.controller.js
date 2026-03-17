const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/jwt.middleware");

exports.userRegister = async (req,res) => {
   try{
    const {email,name, password} = req.body;

    const isExists = await userModel.findOne({
        email: email
    })

    if(isExists){
        return res.status(422).json({
            message: "User already exists with email.",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, name, password
       });

    res.status(201).json({
        message: "User registered successfully",
        token: generateToken(user._id)
    });
   }
   catch(err){
       res.status(500).json({message: err.message});
   }
};

exports.loginUser = async (req,res) => {
    try{
        const{email, password} = req.body;
        const user = await userModel.findOne({ email }).select("+password");

        if(!user){
            return res.status(400).json({message: 'Invalid email'});
        }
       
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        res.json({
            message:"Login Successfully",
            token: generateToken(user._id)
        });

    }catch(err){
        res.status(500).json({message: err.message});
    }
};
