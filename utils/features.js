import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    const data = await mongoose.connect(uri, { dbName: "Yummy" });
    console.log("Connected to DB: ", data.connection.host);
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
};
