const express = require("express")
const {connectdb} = require("./lib/db")
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const {app, server} = require("./lib/socket")
const path = require("path");

const PORT = process.env.PORT;

const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");

const allowedOrigins = [
    'http://localhost:5173',
    'https://chatty-application-6kms.onrender.com' 
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());


//Mounting
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}



app.get("/", (req, res)=>{
    res.send("Yooo");
})

server.listen(PORT, ()=>{
    console.log(`Server is listening at ${PORT}`);
    connectdb();
})