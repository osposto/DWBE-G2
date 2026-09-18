# AgroGestión P1 - Sistema de Cuentas Agropecuarias
**Materia:** Desarrollo Web Backend  
**Carrera:** Tecnicatura Superior  
**Trabajo Práctico:** TP1 - Proceso P1: Alta comercial y técnica de cuentas agropecuarias  
**Tecnologías:** Node.js, Express.js, Pug Template Engine, POO, Persistencia en JSON  

---

## 1. Descripción Funcional del Proceso P1

El **Proceso P1** corresponde al módulo central de apertura comercial y vinculación técnica de cuentas de productores agropecuarios.

### Funcionalidades del Sistema:
- **Alta Comercial de Productores:** Registro validado de cuentas comerciales con validación fiscal de CUIT en formato obligatorio `XX-XXXXXXXX-X`.
- **Asignación Técnica de Agrónomos:** Vinculación directa de cada cuenta a un ingeniero agrónomo referente.
- **Parametrización Contractual:** Clasificación según tipo de contrato (`mensual`, `anual`, `quinquenal`).
- **Ficha Técnica Dinámica:** Consulta de expedientes individuales mediante parámetro de ruta (`/clientes/:accountNumber`).
- **Ciclo de Vida de Cuentas (CRUD Completo):**
  - `GET /clientes`: Listado general de cuentas activas.
  - `POST /clientes`: Alta de nuevas cuentas con validación.
  - `GET /clientes/:accountNumber`: Detalle individual de cuenta.
  - `PUT /clientes/:accountNumber`: Actualización total de la cuenta.
  - `PATCH /clientes/:accountNumber`: Modificación puntual de campos (ej. cambio de agrónomo o contrato).
  - `DELETE /clientes/:accountNumber`: Eliminación o baja física de la cuenta.
- **Persistencia Asincrónica en JSON:** Almacenamiento no bloqueante en `data/clients.json` a través de `fs/promises`.
- **Marcado Semántico y SEO Técnico:** Vistas renderizadas en Pug con jerarquía de títulos estricta (un solo `h1`), meta descripciones dinámicas, marcado accesible para lectores de pantalla y archivo `robots.txt`.

---

## 2. Estructura del Proyecto

```plaintext
DWBE_TP1/
├── app.js                            # Inicialización de Express, middlewares y puerto
├── package.json                      # Dependencias (express, pug) y scripts
├── .gitignore                        # Reglas de exclusión para Git
├── README.md                         # Documentación técnica y funcional
├── MASTER_OUTLINE.md                 # Consigna maestra de desarrollo
├── src/
│   ├── models/
│   │   ├── Client.js                 # Entidad de dominio Cliente con encapsulamiento
│   │   └── ClientDAO.js              # Objeto de acceso a datos con fs/promises
│   ├── controllers/
│   │   └── clientController.js       # Lógica de negocio y renderizado de vistas
│   ├── routes/
│   │   └── clientRoutes.js           # Enrutador modular de Express (/clientes)
│   ├── middlewares/
│   │   ├── cuitValidator.js          # Validador fiscal de CUIT y campos obligatorios
│   │   ├── requestLogger.js          # Logger en consola (método, ruta, timestamp)
│   │   └── errorHandler.js           # Manejador de 404 amigable y error 500
│   └── views/
│       ├── layout.pug                # Plantilla base con marcado semántico y SEO
│       ├── clients-list.pug          # Listado accesible de cuentas agropecuarias
│       ├── client-form.pug           # Formulario de alta comercial con validaciones
│       ├── client-detail.pug         # Ficha técnica individual dinámica
│       ├── client-edit.pug           # Formulario web para editar cuentas existentes
│       └── 404.pug                   # Vista de error 404 amigable
├── data/
│   └── clients.json                  # Almacenamiento local de cuentas en JSON
├── public/
│   ├── css/
│   │   └── styles.css                # Estilos CSS accesibles y ligeros
│   └── robots.txt                    # Directivas para motores de búsqueda (SEO)
└── docs/
    ├── thunder-client-collection.json# Colección de pruebas para Thunder Client
    ├── requests.http                 # Pruebas directas para VS Code REST Client
    └── guion_video.md                # Estructura minuto a minuto del video explicativo
```

---

## 3. Instrucciones de Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior).
- npm (gestor de paquetes de Node.js).

### Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/osposto/DWBE-G2.git
   cd DWBE_TP1
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

### Ejecución
- **Modo Producción / Estándar:**
  ```bash
  npm start
  ```
- **Modo Desarrollo (con reinicio automático ante cambios):**
  ```bash
  npm run dev
  ```

### Acceso a la Aplicación
Abrir en el navegador web:
- **Listado de Cuentas:** [http://localhost:3000/clientes](http://localhost:3000/clientes)
- **Formulario de Alta Comercial:** [http://localhost:3000/clientes/nuevo](http://localhost:3000/clientes/nuevo)

---

## 4. Mapa de Endpoints y Operaciones HTTP

| Método | Endpoint | Tipo | Código Éxito | Código Error | Descripción |
|---|---|---|:---:|:---:|---|
| `GET` | `/clientes` | Vista / JSON | `200 OK` | `500` | Renderiza la tabla de cuentas o devuelve el JSON. |
| `GET` | `/clientes/nuevo` | Vista HTML | `200 OK` | `500` | Renderiza el formulario de alta comercial accesible. |
| `POST` | `/clientes` | Form / API | `201 / 302` | `400` | Procesa el alta, valida el CUIT y persiste en `clients.json`. |
| `GET` | `/clientes/:numeroCuenta` | Vista / JSON | `200 OK` | `404` | Ficha técnica de la cuenta por parámetro de ruta dinámico. |
| `GET` | `/clientes/:numeroCuenta/editar` | Vista HTML | `200 OK` | `404` | Formulario web para editar datos de una cuenta existente. |
| `POST` | `/clientes/:numeroCuenta/editar` | Form Web | `302 Found` | `400 / 404` | Procesa la edición desde el navegador y redirige a la ficha. |
| `POST` | `/clientes/:numeroCuenta/eliminar` | Form Web | `302 Found` | `404` | Procesa la baja desde el navegador y redirige al listado. |
| `PUT` | `/clientes/:numeroCuenta` | API REST | `200 OK` | `404` | Actualización total de los datos de la cuenta (API). |
| `PATCH` | `/clientes/:numeroCuenta` | API REST | `200 OK` | `404` | Modificación parcial de campos específicos (API). |
| `DELETE` | `/clientes/:numeroCuenta` | API REST | `200 OK` | `404` | Eliminación física de la cuenta en `clients.json` (API). |

---

## 5. Matriz de Roles y Responsabilidades (2 Integrantes)

| Aspecto | Integrante 1: Backend & Arquitectura de Datos | Integrante 2: Vistas, UI/UX & Pruebas |
|---|---|---|
| **Responsabilidades Core** | Inicialización de Express en `app.js`, ruteo dinámico, modelos POO (`Client`, `ClientDAO`), persistencia en `clients.json` y middlewares de validación. | Plantillas Pug semánticas (`layout`, `clients-list`, `client-form`, `client-detail`), SEO técnico (metadatos, estructura de títulos), estilos y pruebas ThunderClient. |
| **Entregables Clave** | `app.js`, `src/models/*`, `src/controllers/*`, `src/middlewares/*`. | `src/views/*`, maquetación responsive, `public/css/*`, `robots.txt`, capturas en `/docs`, guion del video. |
| **Documentación** | Explicación técnica de arquitectura y endpoints en `README.md`. | Matriz de roles, bibliografía formal consultada y guion de video. |

---

## 6. Pruebas y Validación (Thunder Client / REST Client)

En la carpeta [`docs/`](docs/) se incluyen los recursos de validación:
- **Colección Thunder Client:** [`docs/thunder-client-collection.json`](docs/thunder-client-collection.json) con los 8 casos de prueba configurados.
- **Archivo de Peticiones Directas:** [`docs/requests.http`](docs/requests.http) ejecutable directamente en Visual Studio Code.
- **Guion del Video Explicativo:** [`docs/guion_video.md`](docs/guion_video.md) con la distribución temporal (3 a 5 minutos) entre los dos integrantes.

---

## 7. Bibliografía y Referencias Técnicas

- **Node.js Foundation:** *File System API Promises (`fs/promises`)*. [https://nodejs.org/api/fs.html](https://nodejs.org/api/fs.html)
- **Express.js:** *Guide on Routing and Writing Middleware*. [https://expressjs.com/](https://expressjs.com/)
- **Pug Template Engine:** *Language Reference, Attributes, Template Inheritance and Conditionals*. [https://pugjs.org/](https://pugjs.org/)
- **MDN Web Docs:** *HTTP Methods, Status Codes & HTML5 Semantic Elements*. [https://developer.mozilla.org/es/](https://developer.mozilla.org/es/)
- **Google Search Central:** *Robots.txt Specifications and SEO Best Practices*. [https://developers.google.com/search/docs/crawling-indexing/robots/intro](https://developers.google.com/search/docs/crawling-indexing/robots/intro)

---

## 8. Video Explicativo de la Solución
- **Enlace al video:** *[Pendiente de grabación / insertar link aquí]*

