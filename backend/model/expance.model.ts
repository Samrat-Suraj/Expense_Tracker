import mongoose from "mongoose";

const expanceSchema = new mongoose.Schema({
    image: { type: String, required: true },
    userId: { type: String, required: true },
    item: { type: String, required: true },
    price: { type: Number, required: true },
    expanceCategory: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String, required: true },
}, { timestamps: true })

const Expance = mongoose.model("Expance", expanceSchema)
export default Expance;