const express = require("express");
const path = require("path");



let {signUp,signIn,signOut} = require(path.join(__dirname,"..","handlers","auth.handler.js"))

const authRouter = express.Router();


authRouter.post("/signup",signUp);
authRouter.post("/signIn",signIn);
authRouter.post("/admin/signup",signUp);
authRouter.get("/admin/logout", signOut);
authRouter.get("/logout", signOut);

module.exports = authRouter;