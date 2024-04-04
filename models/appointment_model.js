import mongoose from 'mongoose';
const uri = "mongodb+srv://albertliumr:TO5ZyE9PjM9yIxYx@cluster0.idyc212.mongodb.net/assignment4?retryWrites=true&w=majority";

mongoose.connect(uri)
.then(() => {
    console.log("Connected to MongoDB successfully.")
}).catch((err) => {
    console.log(`Connection Failed due to error: \n${err}`);
});

const appointmentSchema = mongoose.Schema({
    date: {type: String, required: true},
    time: {type: String, required: true},
    isTimeSlotAvailable: {type: Boolean, default: true}
});

const appointmentModel = mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
