import { Schema, model } from "mongoose";

const userSchema = Schema({
    userName:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = model("userModel", userSchema);

export default User