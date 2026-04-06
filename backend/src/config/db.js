import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Connected database successfully");
  } catch (error) {
    console.error("Error when connecting to database", error);
    // make sure to close the connection
    process.exit(1);
  }
};
