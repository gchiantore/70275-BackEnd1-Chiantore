import { CartManager } from '../cartManager.js';
import { Router } from 'express';

const router=Router();

const cManager=new CartManager('carts.json');

router.get('/:cid',async(req,res)=>{
    const carts=await cManager.getCarts();// Obtengo todo los datos de los carritos
    const cart=carts.find(cart => cart.id === +req.params.cid); // Busco el carrito por ID
    if (cart){
        res.status(200).send({data:cart});
    }else{
        res.status(400).send({error:'No existe el carrito'});
    }
})

router.post('/',async(req,res)=>{
    //Agrego el carrito con Id autogenerado y vacío
    const carts=await cManager.getCarts();
    const maxId = carts.length > 0 ? Math.max(...carts.map(item => item.id)) : 0; // Autogenero el ID del Carrito 
    const cart=await cManager.createCart({id:maxId+1, products:[]});
    res.status(200).send({data:cart});
})


router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const carts = await cManager.getCarts(); // Obtengo todo los datos de los carritos
        const cart = carts.find(cart => cart.id === +req.params.cid); // Busco el carrito por ID

        if (cart) {
            const existingProduct = cart.products.find(product => product.id === +req.params.pid);

            if (existingProduct) {
                existingProduct.quantity++; // Si el producto ya existe, le aumento la cantidad
            } else {
                cart.products.push({ id: +req.params.pid, quantity: 1 }); // Si no existe, agrego nuevo producto
            }

            // Actualizo el carrito
            const updatedCart = await cManager.updateCart(cart.id, cart.products);
            res.status(200).send({data: updatedCart });
        } else {
            res.status(400).send({ error: 'No existe el carrito' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error en el servidor' });
    }
});


router.put('/:cid',async(req,res)=>{
    
})

router.delete('/:cid',async(req,res)=>{
    
})

export default router;