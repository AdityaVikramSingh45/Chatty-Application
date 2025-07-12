const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();

exports.generateToken = (userId, res)=>{
    // { userId } is the payload (Object and hence {userId} and npt just userId)
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"}) 

    // This stores the JWT in a cookie called "jwt" on the client side (browser).
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development"
    });

    return token;
}

// jwt.sign(payload, secret, options)
// JWT is a compact, URL-safe token format used to securely transmit information between two parties — usually a client (browser/app) and a server (your backend).
// It’s widely used for authentication and authorization.

// JWT
// When a user logs in or signs up:
// Your server generates a JWT token that includes the user’s info (e.g. ID).
// That token is sent to the client.
// For future API requests, the client sends this token along with the request.
// The server verifies it and allows access if it’s valid.

