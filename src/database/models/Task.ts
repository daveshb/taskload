/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model, models, Model } from "mongoose";

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

// Reutiliza el modelo si ya existe para evitar OverwriteModelError
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Task: Model<any> = (models.tasks as Model<any>) || model("tasks", taskSchema);

export default Task;
