const mongoose = require("mongoose");

let connPromise = null;

async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI");
  }
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connPromise) return connPromise;

  connPromise = mongoose.connect(mongoUri, {
    autoIndex: true
  });

  return connPromise;
}

module.exports = { connectDb };

