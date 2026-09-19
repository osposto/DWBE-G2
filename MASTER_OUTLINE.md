Este esquema maestro adapta el plan integral de desarrollo para un equipo de dos integrantes, optimizando la división de tareas, la arquitectura modular con POO, la persistencia en JSON y los estándares de SEO técnico y semántica web.

**1. Matriz de Roles y Responsabilidades (2 Integrantes)**

| Aspecto | Integrante 1: Backend & Arquitectura de Datos | Integrante 2: Vistas, UI/UX & Pruebas |
| --- | --- | --- |
| **Responsabilidades Core** | Inicialización de Express, ruteo dinámico, modelos POO, persistencia en `clients.json` y middlewares. | Plantillas Pug semánticas, SEO técnico (metadatos, estructura de títulos), estilos y pruebas ThunderClient. |
| **Entregables Clave** | `app.js`, `src/models/*`, `src/controllers/*`, `src/middlewares/*`. | `src/views/*`, maquetación responsive, capturas en `/docs`. |
| **Documentación** | Explicación técnica de arquitectura y endpoints en `README.md`. | Matriz de roles, bibliografía formal consultada y edición del video. |

---

**2. Arquitectura de Directorios**

* `/`: `app.js`, `package.json`, `.gitignore`, `README.md`.
* `src/`:
* `models/`: `Client.js` (clase de dominio) y `ClientDAO.js` (acceso a datos con `fs/promises`).
* `controllers/`: `clientController.js` (lógica de negocio y renderizado).
* `routes/`: `clientRoutes.js` (enrutador modular de Express).
* `middlewares/`: `cuitValidator.js` (validación fiscal), `requestLogger.js` y `errorHandler.js`.
* `data/`: `clients.json` (archivo de almacenamiento inicializado como array vacío `[]`).
* `views/`: `layout.pug`, `clients-list.pug`, `client-form.pug`, `client-detail.pug` y `client-edit.pug`.


* `public/`: `css/styles.css` (estilos accesibles y ligeros), `robots.txt`.
* `docs/`: Carpeta con capturas de evidencia de ThunderClient.

---

**3. Modelo de Dominio y Persistencia (POO + JSON)**

* **Estructura del registro en `clients.json`:**
* `accountNumber` (String): Identificador único o número correlativo de cuenta.
* `clientName` (String): Razón social o nombre del productor.
* `cuit` (String): Clave fiscal validada (formato `XX-XXXXXXXX-X`).
* `contractType` (Enum): `'mensual'`, `'anual'` o `'quinquenal'`.
* `assignedAgronomist` (String): Nombre del agrónomo referente asignado.
* `createdAt` (String ISO): Fecha de registro para trazabilidad técnica.


* **Diseño orientado a objetos:**
* **Clase `Client`:** Modela la entidad con encapsulamiento, constructor con asignación de atributos y método `toJSON()` para serialización limpia.
* **Clase `ClientDAO` / `ClientModel`:** Métodos estáticos asíncronos (`findAll()`, `findByAccountNumber()`, `save()`, `update()`, `patch()`, `delete()`) implementados con `fs.promises.readFile` y `fs.promises.writeFile`, garantizando transacciones seguras sin romper el parseo del JSON.



---

**4. Rutas Dinámicas, Middlewares y Vistas con Pug**

* **Flujo de middlewares en Express:**
* Parsing nativo: `express.urlencoded({ extended: true })` y `express.json()`.
* Logger de peticiones: Registra en consola método HTTP, ruta y timestamp.
* `cuitValidator`: Middleware que intercepta el `POST`, valida la longitud/formato del CUIT y los campos requeridos antes de alcanzar el controlador.


* **Endpoints modulares (`/clientes`):**
* `GET /clientes`: Renderiza la tabla o tarjetas de clientes activos (con botones de Ver, Editar y Borrar).
* `GET /clientes/nuevo`: Renderiza el formulario de alta comercial (P1).
* `POST /clientes`: Procesa el alta, guarda en JSON y redirige a la lista con código 302 o 201.
* `GET /clientes/:numeroCuenta`: **Ruta dinámica** que busca por parámetro de ruta y renderiza la ficha técnica individual (`client-detail.pug`).
* `GET /clientes/:numeroCuenta/editar`: Renderiza el formulario web con datos precargados para modificación (`client-edit.pug`).
* `POST /clientes/:numeroCuenta/editar`: Procesa la actualización web y redirige a la ficha técnica (302).
* `POST /clientes/:numeroCuenta/eliminar`: Procesa la baja desde la web con confirmación y redirige a la lista (302).
* `PUT /clientes/:numeroCuenta`: Actualización completa de una cuenta agropecuaria persistiendo en JSON (API).
* `PATCH /clientes/:numeroCuenta`: Actualización parcial de campos específicos (ej. cambio de agrónomo o contrato) (API).
* `DELETE /clientes/:numeroCuenta`: Eliminación o baja física de la cuenta en `clients.json` (API).


* **Reglas de marcado y SEO técnico en Pug:**
* `layout.pug`: Contiene encabezado semántico `<head>` con `meta(charset="utf-8")`, `meta(name="viewport", content="width=device-width, initial-scale=1.0")`, `meta(name="description")` descriptivo, y estructura base `<header>`, `<nav>`, `<main>` y `<footer>`.
* Jerarquía de encabezados estricta: un único `h1` por vista, seguido de `h2` para secciones secundarias.
* Formularios accesibles: atributos `for` e `id` vinculados en cada `<label>` e `<input>`, validación HTML5 nativa (`required`, `pattern`).



---

**5. Plan de Pruebas con ThunderClient**

* **Casos de prueba a registrar:**
* `POST /clientes` exitoso: Envío de payload JSON con los 5 campos obligatorios. Validación de código HTTP 201/302 y verificación en el archivo `clients.json`.
* `POST /clientes` fallido: Envío de payload con CUIT mal formado o campo faltante. Validación de código de error 400 emitido por el middleware.
* `GET /clientes/:accountNumber`: Petición a cuenta existente para validar resolución de ruta dinámica y respuesta correcta (200 OK).
* `PUT /clientes/:accountNumber`: Actualización completa de datos con verificación de código 200 OK y actualización en `clients.json`.
* `PATCH /clientes/:accountNumber`: Modificación puntual (ej. nuevo agrónomo asignado) con verificación de código 200 OK.
* `DELETE /clientes/:accountNumber`: Eliminación de cuenta con verificación de código 200 OK y posterior 404 Not Found al intentar consultarla.


* **Evidencia requerida:** Exportación de la colección de capturas de pantalla nítida guardada en `docs/evidencia-thunderclient`.

---

**6. Estructura de Documentación y Video Final**

* **`README.md`:**
* Instrucciones de clonación, instalación (`npm install`) y ejecución (`npm run dev` o `npm start`).
* Descripción funcional del Proceso P1 (Alta comercial y técnica de cuentas agropecuarias).
* Tabla de integrantes con roles y asignación de tareas específicas.
* Sección de bibliografía técnica: enlaces a la documentación oficial de Node.js, Express.js y Pug template engine.
* Enlace al video explicativo alojado (YouTube, Drive o Vimeo).