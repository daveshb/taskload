/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model, models, Model } from "mongoose";

const usersSchema = new Schema({
    cc: {
        type: String,
        required: [true, "The cc is required"],
    },
    name: {
        type: String,
        required: [true, "The name is required"],
    },
    tel: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
    },
    pass: {
        type: String,
        required: [true, "The password is required"],
    },
});

// Reutiliza el modelo si ya existe para evitar OverwriteModelError
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Users: Model<any> = (models.users as Model<any>) || model("users", usersSchema);

export default Users;
