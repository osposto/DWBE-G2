const fs = require('fs/promises');
const path = require('path');

/**
 * Ruta absoluta al archivo de persistencia JSON.
 */
const DATA_FILE_PATH = path.join(__dirname, '../../data/items.json');

/**
 * Clase ItemModel (Programación Orientada a Objetos)
 * Encapsula las operaciones de lectura y escritura sobre el archivo items.json
 * utilizando el módulo nativo fs/promises para garantizar operaciones no bloqueantes.
 */
class ItemModel {
  /**
   * Lee y parsea el archivo JSON de datos.
   * @private
   * @returns {Promise<Array>} Lista de productos.
   */
  static async _readData() {
    try {
      const content = await fs.readFile(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Si el archivo no existe aún, retorna array vacío
        return [];
      }
      throw new Error(`Error al leer los datos: ${error.message}`);
    }
  }

  /**
   * Guarda de forma atómica y formateada la lista de productos en el archivo JSON.
   * @private
   * @param {Array} data - Lista de productos a persistir.
   */
  static async _writeData(data) {
    try {
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Error al persistir los datos: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los productos, permitiendo filtros opcionales (búsqueda y categoría).
   * @param {Object} [filters={}] - Filtros opcionales (category, q).
   * @returns {Promise<Array>} Lista de productos filtrada o completa.
   */
  static async findAll(filters = {}) {
    const items = await this._readData();
    let result = [...items];

    // Filtro por categoría (ej: ?category=Perifericos)
    if (filters.category && filters.category.trim() !== '') {
      const categoryFilter = filters.category.trim().toLowerCase();
      result = result.filter(item => 
        item.category && item.category.toLowerCase() === categoryFilter
      );
    }

    // Filtro por término de búsqueda (ej: ?q=teclado)
    if (filters.q && filters.q.trim() !== '') {
      const searchTerm = filters.q.trim().toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm))
      );
    }

    return result;
  }

  /**
   * Busca un producto por su ID único.
   * @param {number|string} id - Identificador del producto.
   * @returns {Promise<Object|null>} El producto encontrado o null si no existe.
   */
  static async findById(id) {
    const items = await this._readData();
    const numericId = Number(id);
    const item = items.find(i => i.id === numericId);
    return item || null;
  }

  /**
   * Crea y almacena un nuevo producto.
   * Asigna automáticamente un ID incremental.
   * @param {Object} itemData - Datos del nuevo producto.
   * @returns {Promise<Object>} El producto creado.
   */
  static async create(itemData) {
    const items = await this._readData();

    // Generación de ID autoincremental
    const nextId = items.length > 0 
      ? Math.max(...items.map(item => Number(item.id) || 0)) + 1 
      : 1;

    const newItem = {
      id: nextId,
      name: itemData.name.trim(),
      description: itemData.description ? itemData.description.trim() : '',
      price: Number(itemData.price),
      category: itemData.category ? itemData.category.trim() : 'General',
      stock: itemData.stock !== undefined ? Number(itemData.stock) : 0,
      image: itemData.image && itemData.image.trim() !== '' 
        ? itemData.image.trim() 
        : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=500&q=80'
    };

    items.push(newItem);
    await this._writeData(items);
    return newItem;
  }

  /**
   * Actualiza los datos de un producto existente.
   * @param {number|string} id - ID del producto a actualizar.
   * @param {Object} itemData - Nuevos datos para el producto.
   * @returns {Promise<Object|null>} El producto actualizado o null si no se encontró.
   */
  static async update(id, itemData) {
    const items = await this._readData();
    const numericId = Number(id);
    const index = items.findIndex(i => i.id === numericId);

    if (index === -1) {
      return null;
    }

    const currentItem = items[index];

    items[index] = {
      ...currentItem,
      name: itemData.name !== undefined ? itemData.name.trim() : currentItem.name,
      description: itemData.description !== undefined ? itemData.description.trim() : currentItem.description,
      price: itemData.price !== undefined ? Number(itemData.price) : currentItem.price,
      category: itemData.category !== undefined ? itemData.category.trim() : currentItem.category,
      stock: itemData.stock !== undefined ? Number(itemData.stock) : currentItem.stock,
      image: itemData.image !== undefined && itemData.image.trim() !== '' ? itemData.image.trim() : currentItem.image
    };

    await this._writeData(items);
    return items[index];
  }

  /**
   * Elimina un producto por su ID.
   * @param {number|string} id - ID del producto a eliminar.
   * @returns {Promise<Object|null>} El producto eliminado o null si no se encontró.
   */
  static async delete(id) {
    const items = await this._readData();
    const numericId = Number(id);
    const index = items.findIndex(i => i.id === numericId);

    if (index === -1) {
      return null;
    }

    const [deletedItem] = items.splice(index, 1);
    await this._writeData(items);
    return deletedItem;
  }
}

module.exports = ItemModel;

