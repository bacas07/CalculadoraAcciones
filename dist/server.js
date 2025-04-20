import express from 'express';
const PORT = 3000;
const server = express();
server.use(express.json());
try {
    server.listen(PORT, () => {
        console.log('Servidor activo en el puerto: ', PORT);
    });
}
catch (error) {
    console.log('Error activando el servidor');
}
