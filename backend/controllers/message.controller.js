const Message = require("../models/message.model");
const User = require("../models/user.model")
const Cloudinary = require("../lib/cloudinary")

exports.getUserForSidebar = async(req, res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers)
    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during getUserForSidebar",
        });
   }
}

exports.getMessages = async(req, res)=>{
    try{
        const {id: userToChatId} = req.params; //Jisko message bejaa ja rha
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: userToChatId, receiverId: myId},
                {senderId: myId, receiverId: userToChatId}
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during sendMessages",
        });
    }
}

exports.sendMessage = async(req, res)=>{
    try{
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            //upload the image to cloudinary
            const uploadResponse = await Cloudinary.uploader.upload(image);
            const imageUrl = uploadResponse.secure_url;
        }

        // const newMessage = await Message.create({
        //     senderId,
        //     receiverId,
        //     text,
        //     image: imageUrl
        //   });

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        //todo: realtime functionality goes here ==> socket.io

        res.status(200).json(newMessage)
    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during sendMessage",
        });
    }
}