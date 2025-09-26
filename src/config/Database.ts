import mongoose from "mongoose";

const connectDatabase = async (uri: string) => {
  try {
    await mongoose.connect(uri);

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDatabase;
