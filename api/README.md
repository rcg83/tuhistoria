# tuhistoria — API

Express 4 + Mongoose 7 + JWT + Google Gemini AI. Backend del stack MERN de tuhistoria.

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node 18 (Alpine en Docker) |
| Framework | Express 4 |
| Base de datos | MongoDB via Mongoose 7 |
| Auth | bcryptjs + jsonwebtoken (JWT) |
| IA | `@google/generative-ai` (modelo `gemini-2.5-flash`) |
| Loader | `ts-node/esm` para archivos `.ts`, node nativo para `.js` |

## Arquitectura

```
src/
  config/           db.ts (conexión MongoDB), seeder.ts (vacío)
  controllers/      userController.js, storyController.js
  middlewares/       authMiddlewares.js (protect + authorize)
  routes/           userRoutes.js, storyRoutes.js
  schemas/          Modelos legacy: User.js, UserProfile.js, StoryMessage.js
  services/         geminiService.js (comunicación con Gemini API)
  modules/          Capas DDD (parcialmente implementadas)
    auth/           Vacío (application/, domain/, infrastructure/ sin archivos)
    stories/
      domain/       Story.ts (interfaces Message, Story)
      application/  Vacío
      infrastructure/persistence/
        MongoStoryModel.ts   (StoryTemplate schema+model)
        StoryInstance.ts     (StoryInstance interface+schema+model)
```

- **Rutas** → **Controladores** → **Schemas/Modelos** (flujo principal, estilo MVC)
- **Rutas** → **Servicios** (ruta `/test-ai` y `/test-chat` llaman directo a `geminiService.js`)
- **`modules/`** arquitectura hexagonal esbozada: solo la capa de persistencia de stories tiene modelos; el resto está vacío.

## Modelos de datos

### User (schemas/User.js)
```
username, email, password (hash), role: 'user'|'admin' (default 'user'), createdAt
```

### UserProfile (schemas/UserProfile.js)
```
user (ref: User), bio, avatarUrl, location, timestamps
```
Relación 1:1 con User. Se crea automáticamente al registrar.

### StoryTemplate (modules/stories/infrastructure/persistence/MongoStoryModel.ts)
```
title, description, initialText, imageUrl
```
Plantillas precargadas por un admin.

### StoryInstance (modules/stories/infrastructure/persistence/StoryInstance.ts)
```
user (ref: User), template (ref: StoryTemplate), messages[{ role, text, timestamp }]
```
Instancia de una historia en curso, creada cuando un usuario la inicia.

## Rutas

### `/api/users`

| Método | Ruta | Auth | Rol | Descripción |
|---|---|---|---|---|
| POST | `/register` | — | — | Registrar usuario |
| POST | `/login` | — | — | Login, devuelve JWT |
| GET | `/account` | protect | user | Datos de la cuenta |
| GET | `/profile` | protect | user | Perfil del usuario |
| PUT | `/profile/edit` | protect | user | Actualizar perfil |
| GET | `/` | protect | admin | Listar todos los usuarios |
| DELETE | `/delete/:id` | protect | admin | Eliminar usuario |

### `/api/stories`

| Método | Ruta | Auth | Rol | Descripción |
|---|---|---|---|---|
| GET | `/` | protect | user | Listar plantillas |
| POST | `/start` | protect | user | Iniciar historia desde plantilla |
| POST | `/:id/chat` | protect | user | Enviar mensaje (incompleto) |
| POST | `/` | protect | admin | Crear plantilla |
| PUT | `/:id` | protect | admin | Actualizar plantilla |
| DELETE | `/delete/:id` | protect | admin | Eliminar plantilla |
| GET | `/test-ai` | — | — | Probar conexión con Gemini |
| POST | `/test-chat` | — | — | Probar chat contextual |

## Middleware de autenticación

- **`protect`**: extrae token JWT del header `Authorization: Bearer <token>`, lo verifica con `JWT_SECRET`, guarda `{ id, role }` en `req.user`.
- **`authorize(...roles)`: verifica que `req.user.role` esté entre los roles permitidos.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con nodemon + `ts-node/esm` (vigila `.js`, `.ts`) |
| `npm start` | Producción (`node server.js`) |

## Configuración de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default 5000) |
| `MONGO_URI` | URL de conexión a MongoDB |
| `JWT_SECRET` | Clave para firmar tokens JWT |
| `GEMINI_API_KEY` | API key de Google Gemini |

## Pendientes / notas

- `chatWithStory` en `storyController.js`: tiene el catch block vacío y la respuesta de IA (`aiResponse`) se calcula pero nunca se retorna.
- `modules/auth/` completo está vacío (solo existe la estructura de carpetas).
- `src/config/seeder.ts` existe pero está vacío.
- El código es mixto `.js`/`.ts`: los archivos `.ts` se cargan con `ts-node/esm`; los `.js` con node nativo. `tsconfig.json` tiene `strict: false` y `checkJs: false`.
- Sin framework de tests, sin formateador, sin CI.
