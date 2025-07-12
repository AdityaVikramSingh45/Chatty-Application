const express = require("express")
const app = express();
const {connectdb} = require("./lib/db")
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;

const authRoute = require("./routes/auth.route");

app.use(express.json());
app.use("/api/auth", authRoute);

app.get("/", (req, res)=>{
    res.send("Yooo");
})

app.listen(5001, ()=>{
    console.log(`Server is listening at ${PORT}`);
    connectdb();
})