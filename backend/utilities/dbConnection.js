const mongoose = require("mongoose")



  async function  dbConnector(){

    try {

   let X = await mongoose.connect(process.env.DBURI)
    console.log( X.connection.name, "DB Connected With Server");
    
    
     
} catch (error) {

    console.log("Error Occured In DBConnection :" + error);
    
    
}

}


module.exports = dbConnector