import mongoose from 'mongoose';
const uri = "mongodb+srv://albertliumr:TO5ZyE9PjM9yIxYx@cluster0.idyc212.mongodb.net/assignment4?retryWrites=true&w=majority";

mongoose.connect(uri)
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
    }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
