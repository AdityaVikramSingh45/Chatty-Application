const express = require("express");
const { getUserForSidebar, getMessages, sendMessage } = require("../controllers/message.controller");
const { protectRoute } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/user", protectRoute, getUserForSidebar) //Logged in users in contact except me

router.get("/:id", protectRoute, getMessages) // id uski hai jisse bej rhe

router.post("/send/:id",protectRoute, sendMessage)

module.exports = router