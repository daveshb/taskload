/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model, models, Model } from "mongoose";

const productSchema = new Schema({
    nameProduct: {
        type: String,
    },
    price: {
        type: Number,
    },
    file: {
        type: String,
    },
});

// Reutiliza el modelo si ya existe para evitar OverwriteModelError
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Products: Model<any> = (models.products as Model<any>) || model("products", productSchema);

export default Products;
