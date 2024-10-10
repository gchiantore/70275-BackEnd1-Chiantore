import express from 'express';
import config from './config.js';
import initSocket from './sockets.js';
import handlebars from 'express-handlebars';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

import { ProductManager } from './productsManager.js';
import { CartManager } from './cartManager.js'; 


//Creamos Instancias de Managers
const cManager = new CartManager('carts.json');
const pManager = new ProductManager('products.json');   

// Inicializamos los Managers
cManager.init();
pManager.init();        


// inicializamos una instancia de express
const app = express();



const httpServer = app.listen(config.PORT, () => {
    console.log(`Server activo en puerto ${config.PORT}`);
    
    const socketServer = initSocket(httpServer);

    socketServer.emit('start', { message: 'Servidor Socket.IO iniciado correctamente' });
    app.set('socketServer', socketServer);
   
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    app.use('/views', viewsRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/static', express.static(`${config.DIRNAME}/public`));

});

