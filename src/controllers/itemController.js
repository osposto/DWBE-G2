const ItemModel = require('../models/itemModel');

/**
 * Controlador para la entidad de Productos (Items)
 * Coordina la lógica de negocio entre el Modelo (ItemModel) y las Vistas/Respuestas JSON.
 */
class ItemController {
  /**
   * Obtiene y renderiza el listado general de productos.
   * Soporta filtros por categoría y búsqueda mediante query params (?category=X&q=Y).
   * Si la solicitud requiere JSON, responde con el payload de datos.
   */
  static async renderItems(req, res, next) {
    try {
      const { category, q, format } = req.query;
      const items = await ItemModel.findAll({ category, q });

      // Si el cliente pide JSON explícitamente (Thunder Client, API o ?format=json)
      if (format === 'json' || req.headers.accept?.includes('application/json')) {
        return res.status(200).json({
          count: items.length,
          filters: { category: category || null, q: q || null },
          data: items
        });
      }

      // Obtener todas las categorías únicas disponibles para el selector de filtro en la vista
      const allItems = await ItemModel.findAll();
      const categories = [...new Set(allItems.map(item => item.category))];

      res.render('pages/items', {
        title: 'Catálogo de Productos - DWBE Store',
        description: 'Explora nuestro catálogo de productos tecnológicos y accesorios de alta calidad.',
        items,
        categories,
        currentCategory: category || '',
        searchQuery: q || ''
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene y renderiza el detalle de un producto específico por su ID.
   */
  static async renderItemDetail(req, res, next) {
    try {
      const { id } = req.params;
      const item = await ItemModel.findById(id);

      if (!item) {
        if (req.headers.accept?.includes('application/json') || req.query.format === 'json') {
          return res.status(404).json({
            error: 'Producto no encontrado',
            message: `No se encontró ningún producto con el ID ${id}.`
          });
        }

        return res.status(404).render('pages/404', {
          title: 'Producto no encontrado',
          description: 'El producto solicitado no existe o fue dado de baja.',
          errorMessage: `No se encontró ningún producto registrado con el ID ${id}.`
        });
      }

      if (req.headers.accept?.includes('application/json') || req.query.format === 'json') {
        return res.status(200).json({
          data: item
        });
      }

      res.render('pages/item-detail', {
        title: `${item.name} - Detalle del Producto`,
        description: `Información técnica, precio y disponibilidad para ${item.name}.`,
        item
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint de API: Crea un nuevo producto (POST /items).
   */
  static async createItem(req, res, next) {
    try {
      const newItem = await ItemModel.create(req.body);
      res.status(201).json({
        message: 'Producto creado exitosamente.',
        data: newItem
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint de API: Actualiza un producto existente (PUT /items/:id).
   */
  static async updateItem(req, res, next) {
    try {
      const { id } = req.params;
      const updatedItem = await ItemModel.update(id, req.body);

      if (!updatedItem) {
        return res.status(404).json({
          error: 'Producto no encontrado',
          message: `No se encontró el producto con ID ${id} para actualizar.`
        });
      }

      res.status(200).json({
        message: 'Producto actualizado exitosamente.',
        data: updatedItem
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint de API: Elimina un producto por su ID (DELETE /items/:id).
   */
  static async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      const deletedItem = await ItemModel.delete(id);

      if (!deletedItem) {
        return res.status(404).json({
          error: 'Producto no encontrado',
          message: `No se encontró el producto con ID ${id} para eliminar.`
        });
      }

      res.status(200).json({
        message: 'Producto eliminado exitosamente.',
        data: deletedItem
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ItemController;

