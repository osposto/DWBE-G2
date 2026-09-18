# Guion del Video Explicativo: AgroGestión P1

**Duración recomendada:** 3 a 5 minutos  
**Modalidad:** Dos integrantes (Integrante 1: Backend / Integrante 2: Vistas y Pruebas)  
**Tema:** Proceso P1 - Alta comercial y técnica de cuentas agropecuarias

---

## ⏱️ Minuto a Minuto

### 🎬 Minuto 0:00 - 0:45 | Presentación Conjunta y Demo Visual
- **Pantalla:** Navegador web en `http://localhost:3000/clientes` mostrando la tabla de productores.
- **Integrante 1:**
  > *"Buenos días / tardes. Presentamos el Trabajo Práctico N° 1 de Desarrollo Web Backend. Nuestro proyecto implementa el Proceso P1: el sistema de alta y gestión comercial/técnica para cuentas de productores agropecuarios."*
- **Integrante 2:**
  > *"El sistema permite registrar cuentas, asociarles un agrónomo referente, validar claves fiscales (CUIT) y consultar fichas técnicas dinámicas. Como vemos en pantalla, la aplicación cuenta con un listado limpio y un formulario de alta responsivo y accesible."*

---

### 💻 Minuto 0:45 - 2:15 | Integrante 1: Backend, POO, DAO y Middlewares
- **Pantalla:** Visual Studio Code mostrando `src/models/Client.js`, `src/models/ClientDAO.js`, `src/middlewares/cuitValidator.js` y `app.js`.
- **Integrante 1:**
  > *"En la parte del Backend aplicamos el patrón MVC y Programación Orientada a Objetos:*
  > - *En `Client.js` modelamos la entidad `Cliente` con encapsulamiento, constructor normalizado y método `toJSON()`.*
  > - *En `ClientDAO.js` implementamos el patrón Data Access Object utilizando el módulo nativo `fs/promises`. Creamos métodos asincrónicos para el ciclo CRUD completo: `obtenerTodos()`, `buscarPorNumeroCuenta()`, `guardar()`, `actualizarTotal()` para PUT, `actualizarParcial()` para PATCH y `eliminar()` para DELETE, garantizando que el archivo `clients.json` nunca sufra escrituras corruptas.*
  > - *En `cuitValidator.js` creamos un middleware que intercepta el POST para validar que todos los campos requeridos estén presentes y que el CUIT cumpla la expresión regular `XX-XXXXXXXX-X`. Si falla, emite un error 400 Bad Request sin tocar la base de datos.*
  > - *Finalmente, en `clientRoutes.js` implementamos la ruta dinámica `/clientes/:accountNumber` para recuperar y operar sobre cuentas específicas."*

---

### 🎨 Minuto 2:15 - 3:45 | Integrante 2: Vistas Pug, SEO y Thunder Client
- **Pantalla:** VS Code mostrando `src/views/layout.pug`, `src/views/client-form.pug` y la extensión Thunder Client.
- **Integrante 2:**
  > *"En la capa visual y de pruebas:*
  > - *Construimos las vistas con el motor de plantillas **Pug** respetando estándares de SEO técnico y semántica estricta: un único `<h1>` por vista, meta descripciones dinámicas, marcado HTML5 (`header`, `nav`, `main`, `footer`) y el archivo `robots.txt`.*
  > - *En `client-form.pug` garantizamos accesibilidad vinculando cada `<label for="...">` con el `id` de su respectivo input y agregando validación nativa HTML5 con expresiones regulares.*
  > - *Para las pruebas, diseñamos la colección de Thunder Client:*
  >   1. *Ejecutamos `POST /clientes` con datos válidos -> verificamos el código 201 Created y su persistencia física en `clients.json`.*
  >   2. *Ejecutamos `POST /clientes` con CUIT mal formado -> mostramos el rechazo inmediato con código 400 Bad Request.*
  >   3. *Probamos la ruta dinámica `GET /clientes/:accountNumber` obteniendo el código 200 OK con la ficha individual.*
  >   4. *Demostramos las operaciones complementarias `PUT` y `PATCH` para actualización y `DELETE` para baja de cuenta."*

---

### 🏁 Minuto 3:45 - 4:00 | Conclusión y Cierre
- **Pantalla:** Portada de la aplicación o cámara de los integrantes.
- **Integrante 1 y 2:**
  > *"El proyecto cumple con la totalidad de los requisitos del Master Outline, manteniendo un código limpio, modular y fácil de mantener. Muchas gracias por su atención."*

