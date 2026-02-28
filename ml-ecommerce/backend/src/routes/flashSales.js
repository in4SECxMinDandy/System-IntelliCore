// ==========================================
// Flash Sale Routes — IntelliCore Ecommerce
// ==========================================

const express = require('express');
const router = express.Router();
const flashSaleController = require('../controllers/flashSaleController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/active', flashSaleController.getActiveSales);
router.get('/:id', flashSaleController.getById);

// Admin routes (all protected + admin)
router.get('/', authenticate, authorize('admin', 'superadmin'), flashSaleController.getAll);
router.post('/', authenticate, authorize('admin', 'superadmin'), flashSaleController.create);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), flashSaleController.update);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), flashSaleController.delete);

// Items management
router.post('/:id/items', authenticate, authorize('admin', 'superadmin'), flashSaleController.addItem);
router.delete('/:id/items/:itemId', authenticate, authorize('admin', 'superadmin'), flashSaleController.removeItem);

module.exports = router;
