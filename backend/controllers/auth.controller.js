const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils");

exports.signup = async(req, res)=>{
   const {fullName, email ,password} = req.body;
   try{

    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }
    if(password.length < 6){
        return res.status(400).json({
            success: false,
            message: "Password must be atleast 6 characters"
        })
    }

    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({
            success: false,
            message: "Email already exist"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    })

    if(newUser){
        //generate token here
        generateToken(newUser._id, res);
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user:{
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            }  
        })
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid user data",
        });
    }
   }
   catch(error){
    console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during signup",
        });
   }
}

exports.login = (req, res)=>{
    res.send("Signup Route")
}

exports.logout = (req, res)=>{
    res.send("logout Route")
}