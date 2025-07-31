const express = require("express");
const { getUsersForSidebar, getMessages, sendMessage } = require("../controllers/message.controller");
const { protectRoute } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar) //Logged in users in contact except me

router.get("/:id", protectRoute, getMessages) // id uski hai jisse bej rhe

router.post("/send/:id",protectRoute, sendMessage)

module.exports = router