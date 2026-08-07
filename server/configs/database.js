const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    const primaryUrl = process.env.MONGODB_URL;
    const localUrl = "mongodb://127.0.0.1:27017/confetti";

    mongoose.connect(primaryUrl)
        .then(() => console.log("DB CONNECTION SUCCESSFUL"))
        .catch((err) => {
            console.warn("MongoDB Atlas connection failed:", err.message);
            console.log("Attempting fallback to local MongoDB...");

            mongoose.connect(localUrl)
                .then(() => console.log("DB LOCAL FALLBACK SUCCESSFUL"))
                .catch((localErr) => {
                    console.error("DB CONNECTION FAILED (Both Atlas and Local):", localErr.message);
                    console.warn("Server will continue running in fallback mode without crashing.");
                });
        });
};