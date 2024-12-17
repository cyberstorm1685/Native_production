import mongoose from "mongoose";

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category name is required"], // Custom error message
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Creating and exporting the Category model
const Category = mongoose.model("Category", categorySchema);

export default Category;
