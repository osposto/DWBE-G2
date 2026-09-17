const app = require('./app');

// Definición del puerto de escucha (variable de entorno o 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Inicio del servidor HTTP
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Servidor ejecutándose correctamente en el puerto ${PORT}`);
  console.log(`🌐 Acceso local: http://localhost:${PORT}`);
  console.log(`📦 Catálogo:     http://localhost:${PORT}/items`);
  console.log(`ℹ️  Acerca de:    http://localhost:${PORT}/about`);
  console.log('====================================================');
});

