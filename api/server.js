const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('¡Hola! El contenedor de la API está vivo 🚀');
});

app.listen(5000, () => {
    console.log('Servidor corriendo en el puerto 5000');
});
