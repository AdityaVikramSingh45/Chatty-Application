const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils");
const cloudinary = require("../lib/cloudinary")

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

exports.login = async(req, res)=>{
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        generateToken(user._id, res);

        return res.status(201).json({
            success: true,
            message: "Login successful",
            user:{
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            }  
        })

    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
}

exports.logout = (req, res)=>{
    try{
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({
            message: "Logout successfully"
        })
    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during logout",
        });
    }
}

exports.updateProfile = async(req, res)=>{
    try{
        const {profilePic} = req.body;
        if(!profilePic){
            return res.status(400).json({
                message: "Profile pic not found"
            })
        }

        const userId = req.user?._id;
        if(!userId){
            return res.status(400).json({
                message: "UserId not found"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        if (!uploadResponse || !uploadResponse.secure_url) {
            return res.status(400).json({
                success: false,
                message: "Failed to upload image to Cloudinary",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        return res.status(200).json(updatedUser)

    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during update profile",
        });
    }
}

exports.checkAuth = (req, res)=>{
    try{
        return res.status(200).json(req.user);
    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during check auth",
        });
    }
}