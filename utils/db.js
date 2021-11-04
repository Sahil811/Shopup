import mongoose from "mongoose";

const connection = {};

async function connnect() {
  if (connection.isConnected) {
    console.log("Mongoose is already connected");
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;

    if (connection.isConnected === 1) {
      // This connection is open and ready to use.
      console.log("use previous connection");
      return;
    }

    await mongoose.disconnect(); // connection.isConnected !== 1 then disconnect.
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,      // Not supported anymore
  });

  console.log("New connection");

  connection.isConnected = db.connection[0].readyState;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("Not disconnected");
    }
  }
}

const db = { connnect, disconnect };

export default db;
