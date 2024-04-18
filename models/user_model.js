import mongoose from 'mongoose';
import {} from "dotenv/config";

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB successfully.")
}).catch((err) => {
    console.log(`Connection Failed due to error: \n${err}`);
});

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    userType: {type: String, required: true},
    firstName: {type: String, required: true, default: "DEFAULT"},
    lastName: {type: String, required: true, default: "DEFAULT"},
    age: {type: Number, required: true, default: 0},
    licenseNumber: {type: String, required: true, default: "DEFAULT"},
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointment'
    },
    carDetails: {
        make: {type: String, required: true, default: "DEFAULT"},
        model: {type: String, required: true, default: "DEFAULT"},
        year: {type: Number, required: true, default: 0},
        platno: {type: String, required: true, default: "DEFAULT"},
    },
    testType: {type: String},
    testComment: {type: String},
    testPassed: {type: Boolean},
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
