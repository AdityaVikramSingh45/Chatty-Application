const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const User = require("../models/user.model");
dotenv.config();

exports.protectRoute = async(req, res, next)=>{
    try{
        const token = req.cookies.jwt  //jwt is the name of cookie and hence jwt here

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded || !decoded.userId){
            return res.status(401).json({ message: "Unauthorized: Token Invalid" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;

        next();
    }
    catch(error){
        console.log("Error occured during protectRoute", error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}