import fs from 'fs';

export class ProductManager {
    constructor(file) {
        this.file = file;
        this.init();
    }

    async init() {
        try {
            const exists = await fs.promises.access(this.file);
            console.log('El archivo existe');
        } catch (err) {
            console.log('El archivo NO existe');
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    async #readProductsFile() {
        const users = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(users);
    }

    async createProduct(data) {
        const products = await this.#readProductsFile();
        products.push(data);
        await fs.promises.writeFile(this.file, JSON.stringify(products));
        console.log('Producto agregado');
    }
    async updateProduct(id, data) {
        const products = await this.#readProductsFile();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...data };
            await fs.promises.writeFile(this.file, JSON.stringify(products));
            console.log('Producto actualizado');
        }
    }

    async deleteProduct(id) {
        const products = await this.#readProductsFile();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            await fs.promises.writeFile(this.file, JSON.stringify(products));
            console.log('Producto eliminado');
        }
    }
    async getProducts() {
        return await this.#readProductsFile();
    }
}