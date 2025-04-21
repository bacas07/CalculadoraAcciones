import express from 'express';
import { connectDB } from './database/mongo.js';
const PORT = process.env.PORT || 3000;
const server = express();
server.use(express.json());
const startingServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log('> Servidor activo en el puerto: ', PORT, '(❁´◡`❁)');
        });
    }
    catch (error) {
        console.error('> Error activando el servidor (っ °Д °;)っ');
        process.exit(1);
    }
};
startingServer();
