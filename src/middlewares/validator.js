/**
 * Middleware de validación para parámetros y cuerpo de solicitudes (payloads).
 */

/**
 * Valida que el parámetro :id sea un valor numérico positivo válido.
 */
const validateIdParam = (req, res, next) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    // Si la petición espera JSON o es método de API
    if (req.xhr || req.headers.accept?.includes('application/json') || ['PUT', 'DELETE'].includes(req.method)) {
      return res.status(400).json({
        error: 'Identificador no válido',
        message: 'El parámetro ID debe ser un número entero positivo.'
      });
    }

    return res.status(400).render('pages/404', {
      title: 'Identificador Inválido - Catálogo',
      description: 'El ID proporcionado no tiene un formato válido.',
      errorMessage: 'El ID solicitado no es válido.'
    });
  }

  next();
};

/**
 * Valida los campos obligatorios al crear un nuevo producto (POST).
 */
const validateItemCreation = (req, res, next) => {
  const { name, price, category } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('El campo "name" es obligatorio y no puede estar vacío.');
  }

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) <= 0) {
    errors.push('El campo "price" es obligatorio y debe ser un número mayor a 0.');
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('El campo "category" es obligatorio.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Error de validación',
      details: errors
    });
  }

  next();
};

/**
 * Valida los datos al actualizar un producto (PUT).
 */
const validateItemUpdate = (req, res, next) => {
  const { price, stock } = req.body;
  const errors = [];

  if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
    errors.push('Si se proporciona "price", debe ser un número mayor a 0.');
  }

  if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock)))) {
    errors.push('Si se proporciona "stock", debe ser un número entero no negativo.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Error de validación',
      details: errors
    });
  }

  next();
};

module.exports = {
  validateIdParam,
  validateItemCreation,
  validateItemUpdate
};

