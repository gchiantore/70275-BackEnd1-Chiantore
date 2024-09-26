import fs from 'fs';

export class ProductManager {
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

    async #readProductsFile() {
        const users = await fs.promises.readFile(this.file, 'utf-8');
        // Importante utilizar JSON.parse para convertir el contenido de texto del archivo
        // en un objeto standard javascript utilizable
        return JSON.parse(users);
    }

    async createProduct(data) {
        // Recupera el array de users desde archivo, le agrega la nueva data y actualiza
        const products = await this.#readProductsFile();
        products.push(data);
        // Importante utilizar JSON.stringify para convertir el objeto en versión texto
        // almacenable en el archivo
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