import fs from 'fs';

export class CartManager {
    constructor(file) {
        this.file = file;
        this.init();
    }

    async init() {
        try {
            // Si el archivo existe, los permisos de acceso podrán leerse y la promesa se resolverá (resolve)
            // No tenemos que hacer nada.
            const exists = await fs.promises.access(this.file);
            console.log('El archivo existe');
        } catch (err) {
            // Si no existe, se rechazará (reject)
            // Creamos el archivo y lo inicializamos con un array vacío
            console.log('El archivo NO existe');
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    async #readCartFile() {
        const carts = await fs.promises.readFile(this.file, 'utf-8');
        // Importante utilizar JSON.parse para convertir el contenido de texto del archivo
        // en un objeto standard javascript utilizable
        return JSON.parse(carts);
    }

    async createCart(data) {
        // Recupera el array de users desde archivo, le agrega la nueva data y actualiza
        const carts = await this.#readCartFile();
        carts.push(data);
        // Importante utilizar JSON.stringify para convertir el objeto en versión texto
        // almacenable en el archivo
        await fs.promises.writeFile(this.file, JSON.stringify(carts));
        console.log('Carrito agregado');
    }
    async updateCart(id, data) {
        const carts = await this.#readCartFile();
        const index = carts.findIndex(cart => cart.id === id);
        if (index !== -1) {
            carts[index].products = data ;
            await fs.promises.writeFile(this.file, JSON.stringify(carts));
            console.log('Carrito actualizado');
        }
    }

    async deleteCart(id) {
        const carts = await this.#readCartFile();
        const index = carts.findIndex(product => product.id === id);
        if (index !== -1) {
            carts.splice(index, 1);
            await fs.promises.writeFile(this.file, JSON.stringify(products));
            console.log('Producto eliminado');
        }
    }
    async getCarts() {
        return await this.#readCartFile();
    }
}