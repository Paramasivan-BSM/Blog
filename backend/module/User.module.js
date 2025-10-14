const path = require("path");
const { writePost } = require(path.join(__dirname,"..","handlers","user.handler.js"));
const userRouter = require("express").Router();


userRouter.post("/writepost",writePost);


module.exports = userRouter;