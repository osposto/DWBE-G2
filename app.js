const express = require('express');
const path = require('path');

// Importación de middlewares
const logger = require('./src/middlewares/logger');
const { notFoundHandler, errorHandler } = require('./src/middlewares/errorHandler');

// Importación de enrutadores
const pageRoutes = require('./src/routes/pageRoutes');
const itemRoutes = require('./src/routes/itemRoutes');

// Creación de la aplicación Express
const app = express();

// ==========================================
// Configuración del Motor de Plantillas (Pug)
// ==========================================
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// ==========================================
// Middlewares Globales
// ==========================================
// 1. Procesamiento de payloads en JSON
app.use(express.json());

// 2. Procesamiento de datos de formularios (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// 3. Logger de peticiones HTTP en consola
app.use(logger);

// 4. Servicio de recursos estáticos (CSS, imágenes)
app.use(express.static(path.join(__dirname, 'src/public')));

// ==========================================
// Definición de Rutas
// ==========================================
// Rutas de páginas informativas y portada (/, /about)
app.use('/', pageRoutes);

// Rutas de la entidad de productos (/items)
app.use('/items', itemRoutes);

// ==========================================
// Middlewares de Manejo de Errores
// ==========================================
// Captura de rutas inexistentes (404)
app.use(notFoundHandler);

// Manejador centralizado de errores (500)
app.use(errorHandler);

module.exports = app;

