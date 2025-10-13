// src/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Garante que o email é único no banco
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      // Armazena a senha criptografada (NUNCA a senha pura)
      type: String,
      required: true,
    },
    // Campo para Role Based Access Control (RBAC) - Essencial para segurança
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
); // Adiciona campos createdAt e updatedAt

const User = mongoose.model("User", userSchema);
module.exports = User;
