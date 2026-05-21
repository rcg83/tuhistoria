# tuhistoria — frontend

React 19 + Vite 7 + TypeScript (strict) + SASS. Parte del stack MERN de tuhistoria — app de narración interactiva impulsada por Google Gemini AI.

## Arquitectura

Hexagonal (puertos y adaptadores) dividida en dos árboles de directorios:

```
src/
  modules/        Capas dominio/aplicación/infraestructura (TS puro, sin framework)
    auth/         Interfaz AuthApi, AuthStore, casos de uso, adaptador HTTP
    stories/      Modelo de dominio Story y store (aplicación + infraestructura pendiente)
  features/       Conexión con React: Context providers + componentes presentacionales
    auth/         AuthContext (inyecta httpAuthApi), LoginForm, UserButton
    stories/      Scaffolding (components/, context/ vacíos)
  pages/          Componentes de página (Home)
  components/     UI reutilizable (BookWrapper, layout, sidebar, footer)
  lib/            Utilerías genéricas (fetcher.ts)
  styles/         SCSS global (variables, mixins, hoja de estilos principal)
```

- **`modules/`** — capas de arquitectura limpia: `domain/` (interfaces, tipos, contratos de store), `application/` (casos de uso, fábricas), `infrastructure/` (clientes HTTP, adaptadores React).
- **`features/`** — providers de React Context que conectan los stores de dominio con el árbol de componentes, más componentes UI que los consumen.

### Conexión

```
main.tsx → BrowserRouter → App.tsx
  └─ AuthProvider (inyectado con httpAuthApi desde modules/auth/infrastructure)
      └─ Routes → MainLayout → BookLayout → Home
```

El auth usa un patrón de store liviano: `createAuthStore(api, state, setState)` dentro de un React Context. El token JWT y el usuario persisten en `localStorage`.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite (con polling para compatibilidad Docker) |
| `npm run build` | `tsc -b && vite build` (typecheck primero, luego bundle) |
| `npm run lint` | ESLint (config plana, TS + React hooks + React Refresh) |
| `npm run preview` | Vista previa del build de producción |

## Configuración clave

- **Alias de ruta**: `src/` → `./src` (`vite.config.ts` + `tsconfig.app.json`). Usa `import { x } from 'src/features/...'`.
- **TypeScript**: `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`.
- **SCSS**: indentación de 2 espacios, `_variables.scss` (colores, breakpoints), `_mixins.scss` (`respond-to()`).
- **Vite polling**: `usePolling: true, interval: 100` — necesario para recarga en caliente dentro de Docker.
- **Sin framework de tests** ni formateador configurado.
