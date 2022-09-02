const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connect ERROR", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB DISCONNECTED");
    connectDB();
  });
};
module.exports = connectDB;
