/**
 * Middleware: requestLogger
 * Registra en consola el método HTTP, la ruta solicitada y la marca de tiempo (timestamp).
 */
const registrarPeticion = (req, res, next) => {
  const marcaTiempo = new Date().toISOString();
  console.log(`[${marcaTiempo}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = registrarPeticion;
