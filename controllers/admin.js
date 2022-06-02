import { Product } from "../models/product.js";
import url from 'url';

export function getAddProduct(req, res, next) {
    res.render('admin/editProduct', { 
        pageTitle: 'Add Product', 
        path: '/admin/addProduct',
        editing:false
     });
}

export function postAddProduct(req, res, next) {
    const title=req.body.title;
    const imgUrl=req.body.imgUrl;
    const price=req.body.price;
    const description=req.body.description;
    const id=null;
    const product = new Product(id,title,imgUrl,description,price);
    product.save();
    res.redirect('/');
}
export function getEditProduct(req, res, next) {
    const editMode=Boolean(url.parse(req.url, true).query.edit);
    console.log(editMode);
    const prodId=req.params.productId;
    Product.findById(prodId,product=>{
        if(!product) res,redirect('/');
        res.render('admin/editProduct', { 
            pageTitle: 'Edit Product', 
            path: '/admin/addProduct',
            editing:editMode,
            prod:product
        });
    });

}

export function postEditProduct(req, res, next) {
    const prodId=req.body.productId;
    const updatedTitle=req.body.title;
    const updatedImgUrl=req.body.imgUrl;
    const updatedPrice=req.body.price;
    const updatedDescription=req.body.description;
    const updatedProduct = new Product(prodId,updatedTitle,updatedImgUrl,updatedDescription,updatedPrice);
    updatedProduct.save();
    res.redirect('/');
};

export function postDeleteProduct(req, res, next) {
    const prodId=req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}

export function getProducts(req, res, next) {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
}

