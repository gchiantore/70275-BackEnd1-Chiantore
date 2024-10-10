import { Server } from 'socket.io';
import { ProductManager } from './productsManager.js';

const pManager = new ProductManager('products.json');


const initSocket = (httpServer) => {
    
    
    const io = new Server(httpServer);
    console.log('Servicio socket.io activo');

    io.on('connection', async client => {
        console.log(`Cliente conectado, id ${client.id}`);

        // Enviar los productos actuales al cliente
        const products = await pManager.getProducts();
        client.emit('current_list', products);

        client.on('new_product', (data) => {
            client.broadcast.emit('new_user', data);
        });

        client.on('disconnect', (reason) => {
            console.log(`Cliente desconectado: ${client.id}, motivo: ${reason}`);
        });
    });

    return io;
}

export default initSocket;