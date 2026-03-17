const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database is connected');
    }catch(err){
        console.error("Error connectiong db");
        process.exit(1);
    }
};

module.exports = connectDB;
