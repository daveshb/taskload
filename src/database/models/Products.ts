/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model, Model } from "mongoose";

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

// Utiliza un patrón singleton para garantizar que solo se compile una instancia del modelo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Products: Model<any>;
try {
    // Intenta compilar el modelo solo una vez
    Products = model("products", productSchema);
} catch (error) {
    // Si el modelo ya está compilado, úsalo
    Products = model("products", productSchema);
}

export default Products;
