const express = require("express");
require("dotenv").config();
const path = require("path");
const cookieparser = require("cookie-parser");
const { authChecker } = require("./middlewire/auth.middlewire");




    
const authRouter = require(path.join(__dirname,"module","auth.module.js"));
const userRouter = require(path.join(__dirname,"module","user.module.js"));
const dbConnector = require(path.join(__dirname,"utilities","dbConnection")); 

const app = express();

app.use(express.json());
app.use(cookieparser())

dbConnector();

app.use("/api/auth",authRouter);
app.use("/api/user",authChecker,userRouter);






app.listen(process.env.PORT,()=>{

    console.log(`Server Listening Port: ${process.env.PORT} `);
    console.log("http://localhost:8000");
})