import { ProductManager } from '../productsManager.js';
import { Router } from 'express';

const router=Router();

const pManager=new ProductManager('products.json');

router.get('/',async(req,res)=>{
    if (req.query.limit>0) {
        const products=await pManager.getProducts();
        const listProductLimit=products.slice(0,req.query.limit);
        res.status(200).send({error:null,data:listProductLimit});
    }else{
        const products=await pManager.getProducts();
        res.status(200).send({data:products});
    }
})

router.get('/:pid',async(req,res)=>{
    const products=await pManager.getProducts();
    const product=products.find(product => product.id === +req.params.pid);
    if (product){
        res.status(200).send({data:product});
    }else{
        res.status(400).send({error:'No existe el producto'});
    }
})

router.post('/',async(req,res)=>{
    if (req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description') && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('stock') &&req.body.hasOwnProperty('category')) {
        if (req.body.title && req.body.description && req.body.code && req.body.price && req.body.stock && req.body.category) {
            const products=await pManager.getProducts();
            const maxId = products.length > 0 ? Math.max(...products.map(item => item.id)) : 0;
            if (req.body.hasOwnProperty('status')) {
                if (req.body.status===null) {
                    req.body.status=true
                } 
            }
            const product=await pManager.createProduct({id:maxId+1, ...req.body});
            const listProducts=await pManager.getProducts(); // Actualizo listProducts
            
            const socketServer=req.app.get('socketServer');
            socketServer.emit('new_product', {listProducts, state: 'created'});// Notifico a todos los clientes conectados que se ha agregado un nuevo producto
            
            res.status(200).send({data:product});
        }else{
            res.status(400).send({error:'Faltan datos'});
        }
    }else{
        res.status(400).send({error:'Faltan propiedades'});
    }
})

router.put('/:pid',async(req,res)=>{
    const products=await pManager.getProducts();
    if (products.find(product => product.id === +req.params.pid)){
        const product=await pManager.updateProduct(+req.params.pid,req.body);
        
        const listProducts=await pManager.getProducts(); // Actualizo listProducts
        const socketServer=req.app.get('socketServer');
        socketServer.emit('new_product', {listProducts, state: 'updated'});// Notifico a todos los clientes conectados que se ha modificado un producto
        
        res.status(200).send({data:product});
    }else{
        res.status(400).send({error:'No existe el producto'});
    }
})

router.delete('/:pid',async(req,res)=>{
    const products=await pManager.getProducts();
    if (products.find(product => product.id === +req.params.pid)){
        const product=await pManager.deleteProduct(+req.params.pid);

        const listProducts=await pManager.getProducts(); // Actualizo listProducts
        const socketServer=req.app.get('socketServer');
        socketServer.emit('new_product', {listProducts, state: 'delete'});// Notifico a todos los clientes conectados que se ha eliminado un producto
        
        res.status(200).send({data:product});
    }else{
        res.status(400).send({error:'No existe el producto'});
    }    
})

export default router;