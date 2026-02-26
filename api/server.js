import express from 'express';
import { connectDB as connectDB } from './src/config/db.js';

const app = express();

// Conexion a DB
connectDB();

// Middlewares
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: "API tuhistoria" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});