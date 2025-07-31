const express = require("express")
const {connectdb} = require("./lib/db")
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const {app, server} = require("./lib/socket")

const PORT = process.env.PORT;

const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");

app.use(cors({
    origin: 'http://localhost:5173', // React app's origin
    credentials: true                // Allow cookies or auth headers if needed
  }));

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());


//Mounting
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);


app.get("/", (req, res)=>{
    res.send("Yooo");
})

server.listen(PORT, ()=>{
    console.log(`Server is listening at ${PORT}`);
    connectdb();
})