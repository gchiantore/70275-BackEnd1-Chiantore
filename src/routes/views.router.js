import { Router } from 'express';
import { ProductManager } from '../productsManager.js';

const router = Router();
const pManager = new ProductManager('products.json');


router.get('/', async(req, res) => {
    const products=await pManager.getProducts();
    const data = {
        products: products
    }
    res.status(200).render('home', data);
});


router.get('/realtimeproducts', async (req, res) => {
    res.status(200).render('realTimeProducts');
});



export default router;