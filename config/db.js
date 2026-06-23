import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        // Support both MONGO_URI and MONGODB_URI environment variables.
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/college-issues";

        // If no connection string is defined, show a helpful error.
        if (!uri) {
            throw new Error("MongoDB connection string is not defined. Set MONGO_URI or MONGODB_URI in .env.");
        }

        const conn = await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
