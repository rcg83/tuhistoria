# Middlewares

## `authMiddlewares.ts`

Dos middlewares de autenticación y autorización para Express, usados con JWT.

### `protect`

Valida el token JWT enviado en el header `Authorization` con formato `Bearer <token>`. Si es válido, decodifica el payload y lo asigna a `req.user`. Si no hay token o es inválido, responde con `401`.

```ts
router.get('/account', protect, getAccount);
```

### `authorize(...roles)`

Restringe el acceso según el rol del usuario (campo `role` en `req.user`). Si el rol no está incluido en los permitidos, responde con `403`.

```ts
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
```
