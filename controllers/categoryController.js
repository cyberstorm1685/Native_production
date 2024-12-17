import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import asyncHandler from "express-async-handler"; // For handling async requests

// CREATE CATEGORY
export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { category } = req.body;

    // Validation: Ensure category name is provided
    if (!category) {
      return res.status(400).send({
        success: false,
        message: "Please provide a category name",
      });
    }

    // Check if the category already exists
    const existingCategory = await categoryModel.findOne({ category });
    if (existingCategory) {
      return res.status(400).send({
        success: false,
        message: "Category already exists",
      });
    }

    // Create new category
    const newCategory = await categoryModel.create({ category });

    res.status(201).send({
      success: true,
      message: `${category} category created successfully`,
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Category API",
    });
  }
});

// GET ALL CATEGORIES
export const getAllCategoriesController = asyncHandler(async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Categories API",
    });
  }
});

// DELETE CATEGORY
export const deleteCategoryController = asyncHandler(async (req, res) => {
  try {
    // Find the category by ID
    const category = await categoryModel.findById(req.params.id);

    // Validation: Check if the category exists
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Find products associated with this category
    const products = await productModel.find({ category: category._id });

    // Update products to remove the category reference
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined; // Remove category reference from product
      await product.save();
    }

    // Delete the category
    await category.deleteOne();

    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    // Handle invalid ID error (cast error)
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid category ID",
      });
    }

    res.status(500).send({
      success: false,
      message: "Error in Delete Category API",
      error,
    });
  }
});

// UPDATE CATEGORY
export const updateCategoryController = asyncHandler(async (req, res) => {
  try {
    // Find the category by ID
    const category = await categoryModel.findById(req.params.id);

    // Validation: Check if the category exists
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Get the new category name from request body
    const { updatedCategory } = req.body;

    // Validate updated category name
    if (!updatedCategory) {
      return res.status(400).send({
        success: false,
        message: "Please provide an updated category name",
      });
    }

    // Update the category name
    category.category = updatedCategory;

    // Find products associated with this category and update them
    const products = await productModel.find({ category: category._id });
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory; // Update the product's category reference
      await product.save();
    }

    // Save the updated category
    await category.save();

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category: category,
    });
  } catch (error) {
    console.error(error);

    // Handle invalid ID error (cast error)
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid category ID",
      });
    }

    res.status(500).send({
      success: false,
      message: "Error in Update Category API",
      error,
    });
  }
});
