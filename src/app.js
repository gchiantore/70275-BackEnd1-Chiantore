import express from 'express';
import config from './config.js';
// importamos el paquete de rutas dinámicas para manejo de productos
import productsRouter from './routes/products.router.js';
// importamos el paquete de rutas dinamicas para el manejo de carrritos
import cartsRouter from './routes/carts.router.js';

// importamos los Class Managers para manejo de archivos JSON
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




// cargamos los middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Activamos el paquete de rutas dinámicas para manejo de usuarios bajo el prefijo /api/products
app.use('/api/products', productsRouter);
// Activamos el paquete de rutas dinamicas para manejo de productos bajo el prefijo /api/carts
app.use('/api/carts', cartsRouter);
// Activo el paquete de rutas estáticas (servicio complementario) bajo el prefijo /static
app.use('/static', express.static(`${config.DIRNAME}/public`));


// ponemos el servidor a escuchar
app.listen(config.PORT, () => {
    console.log(`Server activo en puerto ${config.PORT}`);
});