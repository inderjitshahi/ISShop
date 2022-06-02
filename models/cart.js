import dirname from '../path.js';
import path from 'path';
import fs from 'fs';
const p = path.join(dirname, 'data', 'cart.json');
export class Cart {

    static fetchAll(callback) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) return callback(null);
            return callback(cart);
        });
    }
    static addProduct(id, productPrice) {
        //Fetch the previous Cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            //Analyze the cart => Find existing product
            // console.dir(cart);
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            //Add new  product or increse the quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = (+cart.totalPrice) + (+productPrice);
            fs.writeFile(p, JSON.stringify(cart), err => {
                // console.log(err);
            })
        });


    }
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) return;
            const cart = JSON.parse(fileContent);
            const updatedCart = { ...cart };
            const product = cart.products.find(prod => prod.id === id);
            if(!product){
                return;
            }
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            cart.totalPrice -= (+productPrice * (+product.qty));
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                // console.log(err) ;
            });

        });
    }

}