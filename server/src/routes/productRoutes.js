import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

const productCreateValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a number greater than or equal to 0'),
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be an integer greater than or equal to 0'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
];

const productUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a number greater than or equal to 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be an integer greater than or equal to 0'),
  body('category')
    .optional()
    .trim()
    .notEmpty().withMessage('Category cannot be empty')
];

// All product routes require authentication
router.use(protect);

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin-only mutations
router.post(
  '/',
  authorize('admin'),
  upload.single('image'),
  validate(productCreateValidation),
  createProduct
);

router.put(
  '/:id',
  authorize('admin'),
  upload.single('image'),
  validate(productUpdateValidation),
  updateProduct
);

router.delete(
  '/:id',
  authorize('admin'),
  deleteProduct
);

export default router;
