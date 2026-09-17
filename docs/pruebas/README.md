# Plan de Pruebas y Evidencias - Thunder Client / Postman / API REST

Este documento detalla los casos de prueba y las colecciones preparadas para validar el cumplimiento de los requerimientos técnicos del Trabajo Práctico.

---

## ⚡ 1. Cómo importar la colección en Thunder Client (VS Code)

1. Abre Visual Studio Code.
2. Abre la pestaña de la extensión **Thunder Client**.
3. Dirígete a la sección **Collections**.
4. Haz clic en el menú contextual (...) y selecciona **Import**.
5. Selecciona el archivo [`docs/thunder-client-collection.json`](../thunder-client-collection.json).
6. Todas las peticiones quedarán listas para ejecutar con un solo clic.

---

## 📮 2. Cómo importar y ejecutar la colección en Postman

1. Abre la aplicación de escritorio o web de **Postman**.
2. Haz clic en el botón **Import** (en la esquina superior izquierda del panel de trabajo).
3. Arrastra o selecciona el archivo [`docs/postman-collection.json`](../postman-collection.json).
4. Verás la colección **"DWBE - TP1 Colección Postman"** con las 10 peticiones organizadas.
5. **Ejecución manual:** Puedes abrir cualquier petición y presionar **Send**.
6. **Ejecución automática (Collection Runner):**
   - Haz clic derecho sobre la colección y selecciona **Run collection**.
   - Haz clic en **Run DWBE - TP1 Colección Postman**.
   - Se ejecutarán automáticamente los 10 endpoints y verás las pruebas automáticas (`pm.test`) en verde pasando al 100%.

> [!NOTE]
> La colección de Postman tiene una variable `baseUrl` configurada por defecto en `http://localhost:3000`. Si cambias el puerto del servidor, solo debes modificar ese valor en la pestaña de variables de la colección.

---

## 📋 3. Matriz de Casos de Prueba

| # | Método | Endpoint | Caso de Prueba | Estado Esperado | Criterio de Aceptación |
|---|--------|----------|----------------|-----------------|------------------------|
| 1 | `GET` | `/items` | Listar catálogo completo en formato JSON | `200 OK` | Array con todos los productos registrados en `items.json`. |
| 2 | `GET` | `/items?category=Periféricos` | Filtrado por parámetro de consulta `category` | `200 OK` | Devuelve únicamente productos de la categoría especificada. |
| 3 | `GET` | `/items?q=teclado` | Búsqueda por coincidencia de texto en nombre/descripción | `200 OK` | Devuelve elementos que coinciden con el término. |
| 4 | `GET` | `/items/1` | Consulta de detalle por ID existente | `200 OK` | Devuelve el objeto del producto con `id: 1`. |
| 5 | `GET` | `/items/9999` | Consulta de detalle por ID inexistente | `404 Not Found` | Respuesta de error con mensaje descriptivo. |
| 6 | `POST` | `/items` | Creación de nuevo producto con payload JSON válido | `201 Created` | Producto creado con ID autoincremental y guardado en `items.json`. |
| 7 | `POST` | `/items` | Validación de campos requeridos ausentes | `400 Bad Request` | Detalle con los campos faltantes o inválidos. |
| 8 | `PUT` | `/items/1` | Actualización parcial de un producto existente | `200 OK` | Producto modificado y persistido en `items.json`. |
| 9 | `DELETE` | `/items/2` | Eliminación física de un producto por ID | `200 OK` | Producto eliminado del archivo `items.json`. |
| 10 | `GET` | `/ruta-desconocida` | Acceso a endpoint inexistente | `404 Not Found` | Manejador centralizado de 404 ejecutado. |

---

## 💻 4. Ejecución alternativa por consola (vía `curl`)

Para verificar los endpoints rápidamente desde la terminal sin abrir aplicaciones externas:

```bash
# 1. Obtener todos los productos (JSON)
curl -s -H "Accept: application/json" http://localhost:3000/items

# 2. Filtrar por categoría
curl -s -H "Accept: application/json" "http://localhost:3000/items?category=Perif%C3%A9ricos"

# 3. Buscar por ID existente (200 OK)
curl -s -H "Accept: application/json" http://localhost:3000/items/1

# 4. Buscar por ID inexistente (404 Not Found)
curl -s -i -H "Accept: application/json" http://localhost:3000/items/9999

# 5. Crear producto (201 Created)
curl -s -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Pad Mouse XXL","description":"Alfombrilla gaming","price":18500,"category":"Accesorios","stock":30}'

# 6. Actualizar producto (200 OK)
curl -s -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"price":49900,"stock":10}'

# 7. Eliminar producto (200 OK)
curl -s -X DELETE http://localhost:3000/items/2
```
