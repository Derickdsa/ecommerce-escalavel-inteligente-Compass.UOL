const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    sku: {
      // Stock Keeping Unit (Código de rastreamento)
      type: String,
      required: true,
      unique: true,
    },
    stockQuantity: {
      // Para controle básico de estoque
      type: Number,
      required: true,
      min: 0,
    },
    // Opcional: Tags, categoria, imagem URL (S3 [cite: 46])
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
