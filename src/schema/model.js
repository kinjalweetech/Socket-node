import mongoose from "mongoose";


const chatSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    timestamp: { type: Date, default: Date.now }
}) 
const model = mongoose.model('country', chatSchema)
export default model;