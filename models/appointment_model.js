import mongoose from 'mongoose';
import {} from "dotenv/config"

mongoose.connect(process.env.MONGO_URI)
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
