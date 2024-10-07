import fs from 'fs';

export class CartManager {
    constructor(file) {
        this.file = file;
    }

    async init() {
        try {
            const exists = await fs.promises.access(this.file);
        } catch (err) {
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    async #readCartFile() {
        const carts = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(carts);
    }

    async createCart(data) {
        const carts = await this.#readCartFile();
        carts.push(data);
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