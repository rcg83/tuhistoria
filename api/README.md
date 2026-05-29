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
| Loader | `ts-node/esm` para archivos `.ts` |

## Arquitectura

```
src/
  config/           db.ts (conexión MongoDB), seeder.ts
  middlewares/       authMiddlewares.ts (protect + authorize)
  routes/           userRoutes.ts, storyRoutes.ts
  services/         geminiService.ts (comunicación con Gemini API)
  modules/          Capas DDD (parcialmente implementadas)
    auth/           Vacío (application/, domain/, infrastructure/ sin archivos)
    stories/
      domain/       Story.ts, StoryInstance.ts, StoryTemplate.ts
      application/  StoryInstanceUseCases.ts, StoryTemplateUseCases.ts
      infrastructure/persistence/
        MongoStoryTemplateModel.ts    (StoryTemplate schema+model)
        MongoStoryInstanceModel.ts    (StoryInstance schema+model)
```

- **Rutas** → **Controladores** → **Modelos** (flujo principal)
- **Rutas** → **Servicios** (ruta `/test-ai` y `/test-chat` llaman directo a `geminiService.ts`)
- **`modules/`** arquitectura hexagonal esbozada

## Modelos de datos

### User (modules/user/infrastructure/persistence/MongoUserModel.ts)
```
username, email, password (hash), role: 'user'|'admin' (default 'user'), createdAt
```

### UserProfile (modules/user/infrastructure/persistence/MongoUserProfileModel.ts)
```
user (ref: User), bio, avatarUrl, location, timestamps
```
Relación 1:1 con User. Se crea automáticamente al registrar.

### StoryTemplate (modules/stories/infrastructure/persistence/MongoStoryTemplateModel.ts)
```
title, description, initialText, imageUrl
```
Plantillas precargadas por un admin.

### StoryInstance (modules/stories/infrastructure/persistence/MongoStoryInstanceModel.ts)
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

- `chatWithStory` en `StoryController.ts`: tiene el catch block vacío y la respuesta de IA (`aiResponse`) se calcula pero nunca se retorna.
- `modules/auth/` completo está vacío (solo existe la estructura de carpetas).
- `tsconfig.json` tiene `strict: false` y `checkJs: false`.
- Sin framework de tests, sin formateador, sin CI.
