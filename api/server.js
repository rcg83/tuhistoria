import express from 'express';
import { connectDB } from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';

const app = express();

// Conexión a DB
connectDB();

// Middlewares
app.use(express.json());

// Usar rutas
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: "API tuhistoria" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});