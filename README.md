# Descripción del Proyecto

## Tecnologías Principales (Stack MERN)

### Global
- **Docker**: Contenerización de la infraestructura para asegurar un despliegue consistente.
- **Stack MERN**: Arquitectura basada en MongoDB, Express, React y Node.js.
- **TypeScript**: Implementación de tipado estático en todo el stack para un desarrollo más seguro y escalable.

### Frontend
- **React**: Biblioteca para la creación de interfaces de usuario dinámicas basadas en componentes.
- **SASS**: Preprocesador CSS para una gestión de estilos modular y profesional.

### Backend
- **Seguridad y Sesiones**:
  - **bcryptjs**: Hashing de contraseñas para garantizar la seguridad de las credenciales.
  - **jsonwebtoken (JWT)**: Gestión de sesiones de usuario de forma segura.
  - **CORS**: Configuración de políticas de intercambio de recursos para la comunicación entre servicios.
- **Base de Datos**:
  - **Mongoose**: Modelado de objetos y validación de esquemas de datos.
- **Inteligencia Artificial (Google AI SDK)**:
  - Integración con el SDK de Gemini para capacidades generativas.
  - **Gestión de Memoria**: Uso de "startChat" para mantener hilos conversacionales fluidos.
  - **Manejo de Contexto**: Optimización en el envío de grandes volúmenes de datos y flujo de tokens.

---

## Instalación y Despliegue

El proyecto está configurado para ejecutarse, facilitando su puesta en marcha en cualquier entorno.

### Requisitos previos
- Docker instalado y configurado.

### Ejecución
Para iniciar todos los servicios del proyecto, se deben seguir los siguientes pasos:

1.  Construir las imágenes.
2.  Iniciar todos los servicios.

```bash
# Comando para construir las imágenes e iniciar los servicios (Docker Compose)
docker compose up --build
```

Una vez ejecutado, los servicios de Frontend, Backend y Base de datos quedarán vinculados y operativos automáticamente.
