const { addMessage, getAllMessage } = require("../controllers/messagesController");

const express = require("express");
const router = express.Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessage);

module.exports = router;