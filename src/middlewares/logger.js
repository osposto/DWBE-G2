/**
 * Middleware Logger de peticiones HTTP
 * Registra en consola el método, la ruta y la marca de tiempo (timestamp)
 * de cada solicitud que llega al servidor.
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logger;

