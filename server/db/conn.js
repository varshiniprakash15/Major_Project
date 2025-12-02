// major_project/server/db/conn.js
const mongoose = require("mongoose");
const DB = process.env.MONGO_URL;




//connecting to mongoose server
mongoose.connect(DB)
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((err) => {
        console.log(err);
    });
