const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/itemController');
const {
  validateIdParam,
  validateItemCreation,
  validateItemUpdate
} = require('../middlewares/validator');

/**
 * Rutas de Colección /items
 */

// GET /items - Listado general de productos con soporte para filtros (?category=X&q=Y)
router.get('/', ItemController.renderItems);

// POST /items - Alta de nuevo producto con validación de campos obligatorios
router.post('/', validateItemCreation, ItemController.createItem);

/**
 * Rutas Dinámicas /items/:id
 */

// GET /items/:id - Detalle renderizado o JSON de un producto según su ID
router.get('/:id', validateIdParam, ItemController.renderItemDetail);

// PUT /items/:id - Actualización de un producto con validación de ID y campos
router.put('/:id', validateIdParam, validateItemUpdate, ItemController.updateItem);

// DELETE /items/:id - Baja de un producto con validación de ID
router.delete('/:id', validateIdParam, ItemController.deleteItem);

module.exports = router;

