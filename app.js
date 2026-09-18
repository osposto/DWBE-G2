const express = require('express');
const path = require('path');

// Middlewares
const registrarPeticion = require('./src/middlewares/requestLogger');
const { manejadorNoEncontrado, manejadorErrorGlobal } = require('./src/middlewares/errorHandler');

// Enrutadores
const rutasClientes = require('./src/routes/clientRoutes');

// Creación de la aplicación Express
const app = express();
const PUERTO = process.env.PORT || 3000;

// ==========================================
// 1. Configuración del Motor de Vistas (Pug)
// ==========================================
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// ==========================================
// 2. Middlewares Globales
// ==========================================
// Parsing de payloads en formato JSON
app.use(express.json());

// Parsing de datos enviados mediante formularios HTML
app.use(express.urlencoded({ extended: true }));

// Logger en consola (método, ruta y timestamp)
app.use(registrarPeticion);

// Publicación de archivos estáticos (CSS, robots.txt)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 3. Definición de Rutas
// ==========================================
// Redirección directa de la raíz a /clientes
app.get('/', (req, res) => {
  res.redirect('/clientes');
});

// Rutas modulares de la entidad /clientes
app.use('/clientes', rutasClientes);

// ==========================================
// 4. Manejo de Errores (404 y 500)
// ==========================================
app.use(manejadorNoEncontrado);
app.use(manejadorErrorGlobal);

// ==========================================
// 5. Arranque del Servidor
// ==========================================
if (require.main === module) {
  app.listen(PUERTO, () => {
    console.log('===========================================================');
    console.log(`🌾 AgroGestión P1 - Servidor activo en el puerto ${PUERTO}`);
    console.log(`🌐 Interfaz web: http://localhost:${PUERTO}/clientes`);
    console.log(`📝 Alta comercial: http://localhost:${PUERTO}/clientes/nuevo`);
    console.log('===========================================================');
  });
}

module.exports = app;
