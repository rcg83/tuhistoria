import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';
import storyRoutes from './src/routes/storyRoutes.js';

/* Deja las constantes del archivo .env listas para usarse. */
dotenv.config();

/* Inicializa la instancia de la aplicación Express. */
const app = express();

/* Inicializa la conexión con MongoDB. */
connectDB();

app.use(cors());

/* Permite a la aplicación interpretar el cuerpo de las peticiones en formato JSON. */
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: "API tuhistoria" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});