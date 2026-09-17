1. Definición y Alcance del Proyecto

    Temática de la aplicación: Selección de un dominio acotado (catálogo de productos, biblioteca de libros o gestión de turnos).

    Estructura del almacenamiento local: Definición del esquema de datos dentro del archivo data.json.

    Asignación de roles y responsabilidades:

        Responsable de arquitectura de datos y modelos (POO).

        Responsable de rutas, middlewares y controladores.

        Responsable de vistas (Pug), maquetado semántico y SEO on-page.

        Responsable de pruebas (ThunderClient), documentación y video.

2. Arquitectura de la Solución y Buenas Prácticas

    Patrón de diseño: Separación de responsabilidades bajo el patrón MVC (Modelo - Vista - Controlador).

    Estructura modular de carpetas:
    Plaintext

    ├── src/
    │   ├── controllers/      # Lógica de negocio para cada ruta
    │   ├── models/           # Clases POO y manejo de data.json
    │   ├── routes/           # Definición de rutas y endpoints
    │   ├── middlewares/      # Funciones intermedias (validaciones, logs)
    │   ├── views/            # Plantillas Pug (layouts, parciales, páginas)
    │   └── public/           # Archivos estáticos (CSS, JS cliente, imágenes)
    ├── data/
    │   └── items.json        # Base de datos basada en JSON
    ├── docs/                 # Evidencias ThunderClient y guion de video
    ├── app.js                # Configuración principal de Express
    └── server.js             # Punto de entrada y levantamiento del servidor

    Programación Orientada a Objetos (POO):

        Clase base Model o entidad específica (ej. ProductManager o Entity) con métodos: findAll(), findById(), create(), update(), delete().

        Encapsulamiento del módulo nativo fs/promises para lectura y escritura atómica del archivo JSON.

3. Implementación Técnica
Configuración del Servidor y Motor de Vistas

    Inicialización de dependencias (express, pug).

    Configuración de Pug: app.set('view engine', 'pug') y app.set('views', path.join(__dirname, 'views')).

    Carpeta pública para recursos estáticos mediante express.static.

Enrutamiento y Rutas Dinámicas

    Configuración de rutas estáticas (/, /about, /items).

    Implementación de rutas dinámicas con parámetros de ruta:

        GET /items/:id: Detalle de elemento con vista renderizada.

        PUT /items/:id o DELETE /items/:id: Operaciones específicas consumibles vía API.

    Parámetros de consulta (req.query) para filtros o búsquedas simples.

Middlewares

    Middlewares globales:

        express.json() y express.urlencoded({ extended: true }) para procesamiento de payloads.

        Logger de peticiones (método, ruta, timestamp).

    Middlewares a nivel de ruta:

        Validador de existencia de ID o de campos requeridos antes de procesar la solicitud.

    Middleware de manejo de errores:

        Captura de rutas no encontradas (error 404 con vista amigable).

        Manejador global de excepciones (error 500).

Plantillas Pug y Optimización Semántica (SEO)

    Layout base (layout.pug) con encabezados estándar:

        Etiquetas <title> y <meta name="description"> contextuales según la vista.

        Marcado jerárquico estricto (h1, h2, main, nav, footer).

        Inclusión de atributos alt descriptivos en imágenes.

    Vistas hijas: listado general y detalle dinámico por ID.

4. Pruebas y Validación (ThunderClient)

    Diseño del plan de pruebas:

        Petición GET a colecciones y a rutas dinámicas /items/:id.

        Petición POST con body en formato JSON para verificar escritura en data.json.

        Casos de error controlados: búsqueda de un ID inexistente (código de estado 404).

    Captura de evidencias: Guardado de capturas de pantalla de ThunderClient con código de estado HTTP, tiempo de respuesta y payload devuelto visible.

5. Documentación y Entrega

    Archivo README.md exhaustivo:

        Descripción funcional del sistema.

        Instrucciones de instalación y ejecución (npm install, npm start).

        Mapa de endpoints y rutas disponibles.

        Cuadro de roles, tareas asignadas y grado de participación.

        Bibliografía y referencias consultadas (documentación oficial de Node.js, Express, Pug, etc.).

    Evidencias de prueba: Directorio /docs/pruebas con las capturas de ThunderClient comentadas.