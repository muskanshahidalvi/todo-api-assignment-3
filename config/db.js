const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;