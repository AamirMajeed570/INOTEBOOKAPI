const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/INOTEBOOK";

const connection = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to mongo successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connection;
