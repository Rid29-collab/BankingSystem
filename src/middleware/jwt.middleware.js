const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn: "3d"}
    );
};

const authMiddleware = async (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"No token"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        req.user = user;
        next();
    }
    catch(err){
        res.status(401).json({message:"Invalid Token"});
    }
};

module.exports = { generateToken, authMiddleware };