# Guion para Video Explicativo / Defensa del Proyecto

**Duración estimada:** 3 a 5 minutos.  
**Objetivo:** Demostrar de forma clara, sencilla y profesional el funcionamiento de la aplicación, su arquitectura y el cumplimiento de la consigna.

---

## ⏱️ Estructura Minuto a Minuto

### Minuto 0:00 - 0:45 | Introducción y Presentación
- **Qué mostrar en pantalla:** Portada del proyecto en el navegador (`http://localhost:3000`) o diapositiva inicial con los datos del alumno/equipo.
- **Qué decir:**
  > *"Buenas tardes profesor/a. En este video presentamos la resolución del Trabajo Práctico N° 1 de Desarrollo Web Backend. Desarrollamos una aplicación web modular para la gestión de un catálogo de productos informáticos, aplicando el patrón Modelo-Vista-Controlador (MVC), Programación Orientada a Objetos y persistencia local en archivos JSON con `fs/promises`."*
- **Mencionar los roles del equipo:**
  1. Arquitectura de datos y modelos POO.
  2. Rutas, middlewares y controladores.
  3. Vistas Pug, maquetado semántico y SEO on-page.
  4. Pruebas con Thunder Client y documentación.

---

### Minuto 0:45 - 1:45 | Arquitectura y Código (MVC + POO)
- **Qué mostrar en pantalla:** Árbol de carpetas en VS Code (`src/`, `data/`, `app.js`, `server.js`).
- **Qué decir:**
  > *"La arquitectura sigue una separación estricta de responsabilidades:*
  > - *En `server.js` tenemos el punto de entrada que escucha en el puerto 3000.*
  > - *En `app.js` configuramos Express, los middlewares globales de parseo JSON y URL-encoded, nuestro middleware propio de logger para registrar cada petición, y configuramos Pug como view engine.*
  > - *En `src/models/itemModel.js` encapsulamos el acceso al archivo `data/items.json` utilizando una clase POO con métodos asincrónicos: `findAll()`, `findById()`, `create()`, `update()` y `delete()`, usando `fs/promises` para evitar bloqueos.*
  > - *En `src/controllers/itemController.js` y `src/routes/itemRoutes.js` gestionamos la lógica y validamos los datos antes de operar."*

---

### Minuto 1:45 - 3:00 | Demostración de Vistas Pug y SEO Semántico
- **Qué mostrar en pantalla:** El navegador interactuando con la aplicación.
- **Qué decir y hacer:**
  1. **Portada (`/`):** Mostrar el hero y productos destacados. Resaltar el uso de etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<footer>`).
  2. **Catálogo (`/items`):**
     - Mostrar el listado completo.
     - Probar el filtro por categoría (ej: "Periféricos") y la búsqueda por texto. Explicar cómo el controlador lee `req.query`.
  3. **Detalle del producto (`/items/:id`):**
     - Hacer clic en "Ver Detalle" de un producto.
     - Mostrar cómo la ruta dinámica `/items/:id` obtiene el ID mediante `req.params`, consulta el modelo y renderiza la vista con sus especificaciones, precio y disponibilidad.
  4. **Página de Error 404:**
     - Ingresar una URL inexistente (ej. `/items/9999` o `/pagina-inexistente`) y mostrar la vista personalizada de error amigable.

---

### Minuto 3:00 - 4:15 | Demostración de Endpoints con Thunder Client
- **Qué mostrar en pantalla:** Visual Studio Code con la extensión **Thunder Client**.
- **Qué decir y hacer:**
  > *"Ahora demostramos el funcionamiento de las operaciones de la API REST a través de Thunder Client:"*
  1. **GET `/items` (con header `Accept: application/json`):** Ejecutar la solicitud y mostrar la respuesta `200 OK` con la colección de productos.
  2. **POST `/items`:** Enviar un nuevo producto en formato JSON. Mostrar el código `201 Created` y abrir el archivo `data/items.json` para corroborar que el nuevo producto se guardó físicamente con su nuevo ID.
  3. **POST `/items` (Caso de error 400):** Enviar un body vacío o con campos incompletos y mostrar cómo el middleware de validación intercepta la petición y responde con `400 Bad Request` sin tocar el archivo de datos.
  4. **PUT `/items/1`:** Modificar el precio de un producto existente y verificar la respuesta `200 OK`.
  5. **DELETE `/items/:id`:** Eliminar un producto y confirmar su remoción en `items.json`.

---

### Minuto 4:15 - 4:45 | Conclusión y Cierre
- **Qué decir:**
  > *"Con esto comprobamos el funcionamiento completo del sistema, la integridad de los datos persistidos, el manejo adecuado de códigos de estado HTTP y una estructura modular fácil de mantener y escalar. Muchas gracias por su atención."*

