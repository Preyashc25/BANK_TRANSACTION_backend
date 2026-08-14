const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB is connected...");
    })
    .catch((error) => {
      console.log("Error While Connecting to DB...");
      process.exit(1);
    });
}

module.exports = connectDB