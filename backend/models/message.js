import { mongoose, model, Schema } from "mongoose";

const messageSchema = new Schema({
    sender:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const messageModel = model("Message", messageSchema);

export default messageModel;