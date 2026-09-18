/**
 * Middleware: errorHandler
 * Manejo centralizado de rutas no encontradas (404) y excepciones globales (500).
 */

/**
 * Captura rutas no existentes (Error 404)
 */
const manejadorNoEncontrado = (req, res, next) => {
  res.status(404);

  // Si la petición espera respuesta JSON (Thunder Client o API)
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.json({
      error: 'Recurso no encontrado',
      ruta: req.originalUrl,
      status: 404
    });
  }

  // Si es un navegador web, renderiza la vista Pug
  res.render('404', {
    title: '404 - Cuenta o Página No Encontrada',
    description: 'El recurso agropecuario solicitado no existe en el sistema.',
    rutaSolicitada: req.originalUrl
  });
};

/**
 * Manejador global de excepciones del servidor (Error 500)
 */
const manejadorErrorGlobal = (err, req, res, next) => {
  console.error('[ERROR NO CONTROLADO]:', err.stack || err.message);

  const codigoEstado = err.status || 500;
  res.status(codigoEstado);

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.json({
      error: 'Error interno del servidor',
      mensaje: err.message,
      status: codigoEstado
    });
  }

  res.render('404', {
    title: '500 - Error Interno',
    description: 'Ocurrió un error inesperado al procesar la solicitud.',
    mensajeError: 'Ocurrió un inconveniente interno en el servidor.'
  });
};

module.exports = {
  manejadorNoEncontrado,
  manejadorErrorGlobal
};
