import mongoose from 'mongoose';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { processImageUpload } from '../middleware/upload.js';

// @desc    Get all products with search, filter, sort, and pagination
// @route   GET /api/products
// @access  Private (Authenticated users)
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  // Build query
  const query = {};

  // Search filter (searches only by product name)
  if (search && search.trim() !== '') {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.name = new RegExp(escapedSearch, 'i');
  }

  // Category filter
  if (category && category.trim() !== '' && category !== 'all') {
    query.category = category.trim();
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // default newest
  if (sort === 'price_asc') {
    sortOption = { price: 1 };
  } else if (sort === 'price_desc') {
    sortOption = { price: -1 };
  } else if (sort === 'newest') {
    sortOption = { createdAt: -1 };
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query)
  ]);

  const pages = Math.ceil(total / limit) || (total === 0 ? 0 : 1);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages
    }
  });
});

// @desc    Get distinct list of product categories
// @route   GET /api/products/categories
// @access  Private (Authenticated users)
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  const filteredCategories = categories.filter(Boolean).sort();

  res.status(200).json({
    success: true,
    data: filteredCategories
  });
});

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Private (Authenticated users)
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID format');
  }

  const product = await Product.findById(id).populate('createdBy', 'name email role');
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  let image = req.body.image || '';

  // If a file was uploaded via multipart/form-data
  if (req.file) {
    const uploadedUrl = await processImageUpload(req.file);
    if (uploadedUrl) {
      image = uploadedUrl;
    }
  }

  const product = await Product.create({
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    stock: parseInt(stock, 10),
    category: category.trim(),
    image,
    createdBy: req.user._id
  });

  const populatedProduct = await Product.findById(product._id).populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: populatedProduct
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID format');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const { name, description, price, stock, category } = req.body;
  let image = req.body.image !== undefined ? req.body.image : product.image;

  // If a file was uploaded via multipart/form-data
  if (req.file) {
    const uploadedUrl = await processImageUpload(req.file);
    if (uploadedUrl) {
      image = uploadedUrl;
    }
  }

  if (name !== undefined) product.name = name.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = parseInt(stock, 10);
  if (category !== undefined) product.category = category.trim();
  if (image !== undefined) product.image = image;

  await product.save();

  const updatedProduct = await Product.findById(product._id).populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID format');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});
