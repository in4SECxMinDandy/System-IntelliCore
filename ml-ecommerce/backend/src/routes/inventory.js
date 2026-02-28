// ==========================================
// Inventory Routes
// ==========================================

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const inventoryController = require('../controllers/inventoryController');

// All routes require admin/staff access
router.use(authenticate);
router.use(authorize('admin', 'superadmin', 'staff'));

// GET /api/admin/inventory/overview
router.get('/overview', inventoryController.getInventoryOverview);

// GET /api/admin/inventory
router.get('/', inventoryController.getInventory);

// GET /api/admin/inventory/low-stock
router.get('/low-stock', inventoryController.getLowStockProducts);

// GET /api/admin/inventory/:productId/logs
router.get('/:productId/logs', inventoryController.getInventoryLogs);

// PUT /api/admin/inventory/:productId/stock
router.put('/:productId/stock', inventoryController.updateStock);

// POST /api/admin/inventory/bulk-update
router.post('/bulk-update', inventoryController.bulkUpdateStock);

module.exports = router;
