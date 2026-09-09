import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("DB Connection Error:", err.message);
  });

  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("Error: MONGODB_URI is not defined in .env");
      return;
    }

    // If URI ends with slash, trim it so dbName works smoothly
    if (uri.endsWith("/")) {
      uri = uri.slice(0, -1);
    }

    await mongoose.connect(uri, {
      dbName: "e-commerce",
    });
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
  }
};

export default connectDB;
