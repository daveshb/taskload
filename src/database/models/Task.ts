/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model, Model } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    limitDate: {
        type: Date,
        required: true,
    },
    subtareas: [
        {
            title: {
                type: String,
                required: true,
            },
            action: {
                type: String,
                required: true,
            },
        },
    ],
});

// Utiliza un patrón singleton para garantizar que solo se compile una instancia del modelo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Task: Model<any>;
try {
    // Intenta compilar el modelo solo una vez
    Task = model("tasks", taskSchema);
} catch (error) {
    // Si el modelo ya está compilado, úsalo
    Task = model("tasks", taskSchema);
}

export default Task;
