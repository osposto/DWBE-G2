/**
 * Middlewares para captura y manejo de errores (404 y 500)
 */

/**
 * Captura solicitudes a rutas no existentes (Error 404).
 */
const notFoundHandler = (req, res, next) => {
  res.status(404);

  // Si la petición espera JSON o proviene de una llamada de API / Thunder Client
  if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api')) {
    return res.json({
      error: 'Recurso no encontrado',
      path: req.originalUrl,
      status: 404
    });
  }

  // Si es un navegador, renderiza la vista 404 amigable
  res.render('pages/404', {
    title: '404 - Página no encontrada',
    description: 'La página o recurso que estás buscando no existe en nuestro catálogo.',
    requestedUrl: req.originalUrl
  });
};

/**
 * Manejador global de excepciones no controladas (Error 500).
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR NO CONTROLADO]:', err.stack || err.message);

  const statusCode = err.status || 500;
  res.status(statusCode);

  if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api')) {
    return res.json({
      error: 'Error interno del servidor',
      message: process.env.NODE_ENV === 'production' ? 'Ocurrió un error inesperado.' : err.message,
      status: statusCode
    });
  }

  res.render('pages/404', {
    title: '500 - Error Interno del Servidor',
    description: 'Ocurrió un inconveniente procesando tu solicitud.',
    errorMessage: 'Ocurrió un error interno en el servidor. Por favor, intenta más tarde.'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};

