# DWBE Store - Trabajo Práctico N° 1
**Materia:** Desarrollo Web Backend  
**Carrera:** Tecnicatura Superior  
**Año / Cuatrimestre:** 3er Año - 1er Cuatrimestre  
**Tecnologías:** Node.js, Express, Pug, POO, Persistencia en JSON  

---

## 1. Descripción Funcional del Sistema

**DWBE Store** es una aplicación web y API REST desarrollada en Node.js que implementa un catálogo interactivo de productos tecnológicos y periféricos informáticos. El proyecto fue diseñado bajo el patrón arquitectónico **Modelo - Vista - Controlador (MVC)** y aplicando principios de **Programación Orientada a Objetos (POO)**.

### Características Principales:
- **Catálogo Web Dinámico:** Interfaz de usuario renderizada desde el servidor con el motor de plantillas **Pug**.
- **Filtros y Búsqueda:** Búsqueda en tiempo real por coincidencia de texto y filtro por categoría mediante parámetros de consulta (`req.query`).
- **Navegación Dinámica por ID:** Rutas dinámicas (`/items/:id`) con control de existencia y páginas de error 404 amigables.
- **Persistencia Asincrónica en JSON:** Almacenamiento local en `data/items.json` gestionado a través de `fs/promises` sin bloquear el bucle de eventos (Event Loop).
- **API REST Completa:** Endpoints para operaciones de lectura (`GET`), creación (`POST`), modificación (`PUT`) y eliminación (`DELETE`).
- **Middlewares Personalizados:** Logger de solicitudes HTTP, validadores de entrada y manejadores globales de error.

---

## 2. Arquitectura del Proyecto

El proyecto sigue una estructura modular limpia donde cada capa tiene una responsabilidad única y delimitada:

```plaintext
DWBE_TP1/
├── src/
│   ├── controllers/
│   │   ├── itemController.js         # Lógica de negocio y renderizado para productos
│   │   └── pageController.js         # Lógica para páginas estáticas (Home y About)
│   ├── models/
│   │   └── itemModel.js              # Clase POO con métodos CRUD y fs/promises
│   ├── routes/
│   │   ├── itemRoutes.js             # Definición de rutas y endpoints de /items
│   │   └── pageRoutes.js             # Definición de rutas estáticas (/ y /about)
│   ├── middlewares/
│   │   ├── logger.js                 # Registro de método, ruta y fecha/hora
│   │   ├── validator.js              # Validación de IDs numéricos y cuerpos JSON
│   │   └── errorHandler.js           # Manejador de 404 amigable y error 500
│   ├── views/
│   │   ├── layouts/
│   │   │   └── layout.pug            # Layout base HTML5 semántico con SEO
│   │   ├── partials/
│   │   │   ├── header.pug            # Barra de navegación principal
│   │   │   └── footer.pug            # Pie de página institucional
│   │   └── pages/
│   │       ├── index.pug             # Portada de bienvenida
│   │       ├── about.pug             # Página informativa del proyecto
│   │       ├── items.pug             # Catálogo y formulario de filtros
│   │       ├── item-detail.pug       # Ficha técnica del producto por ID
│   │       └── 404.pug               # Página de error amigable
│   └── public/
│       └── css/
│           └── styles.css            # Estilos CSS responsivos y modernos
├── data/
│   └── items.json                    # Base de datos local en JSON
├── docs/
│   ├── thunder-client-collection.json# Colección exportable de pruebas
│   ├── postman-collection.json       # Colección exportable para Postman con tests
│   ├── guion_video.md                # Estructura paso a paso para la grabación del video
│   └── pruebas/
│       └── README.md                 # Matriz de casos de prueba y comandos curl
├── app.js                            # Configuración de Express, middlewares y vistas
├── server.js                         # Inicialización y escucha en puerto del servidor
├── package.json                      # Dependencias y scripts del proyecto
└── README.md                         # Documentación principal del repositorio
```

---

## 3. Instrucciones de Instalación y Ejecución

### Prerrequisitos
- **Node.js** (versión 18 o superior recomendada).
- **npm** (incluido con Node.js).

### Pasos de Instalación
1. Clonar o descargar el repositorio en su equipo:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd DWBE_TP1
   ```

2. Instalar las dependencias declaradas en `package.json`:
   ```bash
   npm install
   ```

3. Iniciar el servidor en modo estándar:
   ```bash
   npm start
   ```

   O en modo desarrollo con reinicio automático ante cambios:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador web:
   ```plaintext
   http://localhost:3000
   ```

---

## 4. Mapa de Rutas y Endpoints

### Vistas Web (Renderizadas con Pug)
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Portada con mensaje de bienvenida y productos destacados. |
| `GET` | `/about` | Información institucional, objetivos y cuadro de responsabilidades. |
| `GET` | `/items` | Catálogo completo con buscador por texto (`?q=`) y filtro por categoría (`?category=`). |
| `GET` | `/items/:id` | Ficha técnica y detalle dinámico de un producto específico. |

### Endpoints de API REST (Consumibles con Thunder Client / Postman)
| Método | Endpoint | Parámetros / Body | Código Éxito | Código Error | Descripción |
|---|---|---|---|---|---|
| `GET` | `/items` | Header: `Accept: application/json` | `200 OK` | `500` | Devuelve array con todos los productos. |
| `GET` | `/items?category=Periféricos` | Query param `category` | `200 OK` | `500` | Filtra productos por categoría. |
| `GET` | `/items?q=teclado` | Query param `q` | `200 OK` | `500` | Filtra productos por nombre o descripción. |
| `GET` | `/items/:id` | Param de ruta `:id` | `200 OK` | `400 / 404` | Detalle en formato JSON de un producto. |
| `POST` | `/items` | Body JSON (`name`, `price`, `category`, etc.) | `201 Created` | `400 Bad Request` | Da de alta un nuevo producto y genera ID. |
| `PUT` | `/items/:id` | Body JSON con campos a actualizar | `200 OK` | `400 / 404` | Modifica campos del producto seleccionado. |
| `DELETE` | `/items/:id` | Param de ruta `:id` | `200 OK` | `400 / 404` | Da de baja el producto de `items.json`. |

---

## 5. Cuadro de Roles y Responsabilidades

En cumplimiento de las pautas del trabajo práctico, las tareas se dividieron de acuerdo al siguiente esquema:

| Rol Asignado | Responsable | Tareas Principales | Grado de Participación |
|---|---|---|:---:|
| **Arquitectura de Datos y Modelos (POO)** | Integrante 1 | Diseño de la clase `ItemModel`, persistencia en `data/items.json`, métodos CRUD con `fs/promises`. | 100% |
| **Rutas, Middlewares y Controladores** | Integrante 2 | Configuración en `app.js`, controladores modulares, middlewares de logging, validación y errores (404/500). | 100% |
| **Vistas (Pug), Semántica y SEO On-Page** | Integrante 3 | Maquetado HTML5 (`header`, `nav`, `main`, `footer`), títulos dinámicos, meta descripciones, responsividad CSS. | 100% |
| **Pruebas (Thunder Client), Docs y Video** | Integrante 4 | Colección Thunder Client, diseño de matriz de pruebas, redacción de `README.md` y guion explicativo de video. | 100% |

---

## 6. Evidencias de Pruebas y Recursos

- **Colección para Thunder Client:** Disponible en [`docs/thunder-client-collection.json`](docs/thunder-client-collection.json) para importación directa en VS Code.
- **Colección para Postman:** Disponible en [`docs/postman-collection.json`](docs/postman-collection.json) con pruebas automatizadas (`pm.test`) incorporadas.
- **Detalle de Casos de Prueba:** Explicados paso a paso en [`docs/pruebas/README.md`](docs/pruebas/README.md).
- **Guion de Grabación:** Estructura recomendada para el video en [`docs/guion_video.md`](docs/guion_video.md).

---

## 7. Bibliografía y Referencias Consultadas

- **Node.js Documentation:** *File system promises API (`fs/promises`)*. [https://nodejs.org/api/fs.html](https://nodejs.org/api/fs.html)
- **Express.js Official Guide:** *Routing, Middleware and Application settings*. [https://expressjs.com/](https://expressjs.com/)
- **Pug Template Engine:** *Getting Started, Template Inheritance, Mixins and Syntax*. [https://pugjs.org/](https://pugjs.org/)
- **MDN Web Docs:** *HTML5 Semantic Elements, HTTP Status Codes & REST concepts*. [https://developer.mozilla.org/es/](https://developer.mozilla.org/es/)
- **Thunder Client Documentation:** *Testing APIs in Visual Studio Code*. [https://www.thunderclient.com/](https://www.thunderclient.com/)

