import express from "express";
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// Routes for Category Management
router.post("/create", isAuth, isAdmin, createCategory); // Create category
router.get("/get-all", getAllCategoriesController); // Get all categories
router.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController); // Delete category by ID
router.put("/update/:id", isAuth, isAdmin, updateCategoryController); // Update category by ID

export default router;
