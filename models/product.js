import fs from 'fs';
import path from 'path';
import dirname from '../path.js'
const p = path.join(dirname, 'data', 'products.json');
import {Cart} from './cart.js';

const getProductsfromFile = (callBack) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            callBack([]);
        } else {
            callBack(JSON.parse(fileContent));
        }
    });
};

export class Product {

    constructor(id,title,imgUrl,description,price) {
        this.id=id;
        this.title =title;
        this.price=price;
        this.imgUrl=imgUrl;
        this.description=description;
    }

    save() {
        getProductsfromFile(products => {
            if(this.id){ 
                // if id passed already existing; case of updating a prduct
                const existingProductIndex= products.findIndex(prod=>prod.id===this.id);
                const updatedProducts=[...products];
                updatedProducts[existingProductIndex]=this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    // console.log(err);
                });
            }else{
                this.id= Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    // console.log(err);
                });
            }
        });
    }

    static fetchAll(callBack) {
        getProductsfromFile(callBack);
    }

    static findById(id,callBack){
        getProductsfromFile(products=>{
            const product= products.find((p)=> p.id===id);
            callBack(product);
        });
    }

    static deleteById(id){
        getProductsfromFile(products=>{
            const productPrice=products.find(prod=>prod.id===id).price;
            const updatedProducts=products.filter(prod=> prod.id!==id);
            fs.writeFile(p,JSON.stringify(updatedProducts),err=>{
                if(!err){ //if products is removed, remove it from cart also
                    // console.log(err);
                    Cart.deleteProduct(id,productPrice);
                }
            })
        });
    }

};