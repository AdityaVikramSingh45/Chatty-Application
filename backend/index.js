const express = require("express")
const app = express();
const {connectdb} = require("./lib/db")
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;

const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");

app.use(express.json());
app.use(cookieParser);

//Mounting
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.get("/", (req, res)=>{
    res.send("Yooo");
})

app.listen(5001, ()=>{
    console.log(`Server is listening at ${PORT}`);
    connectdb();
})