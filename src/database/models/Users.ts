/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model, Model } from "mongoose";

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

// Utiliza un patrón singleton para garantizar que solo se compile una instancia del modelo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Users: Model<any>;
try {
    // Intenta compilar el modelo solo una vez
    Users = model("users", usersSchema);
} catch (error) {
    // Si el modelo ya está compilado, úsalo
    Users = model("users", usersSchema);
}

export default Users;
