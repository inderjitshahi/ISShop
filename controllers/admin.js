// import { Product } from  "../models/product.js";
import url from 'url';
import Product from '../models/product.js';
import { validationResult } from 'express-validator';

export function getAddProduct(req, res, next) {
    res.render('admin/editProduct', {
        pageTitle: 'Add Product',
        path: '/admin/addProduct',
        editing: false,
        hasError: false,
        errorMessage: null,
    });
}

export function postAddProduct(req, res, next) {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.user._id;   //type of Object Id
    const product = new Product({ title: title, price: price, imgUrl: imgUrl, description: description, userId: userId });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(442).render('admin/editProduct', {
            path: '/admin/editProduct',
            pageTitle: 'Add Product',
            editing: false,
            hasError: true,
            prod: {
                title: title,
                imgUrl: imgUrl,
                price: price,
                description: description,
            },
            errorMessage: errors.array()[0].msg,
        });
    }
    // if(!image){
    //     return res.status(442).render('admin/editProduct', {
    //         path: '/admin/editProduct',
    //         pageTitle: 'Add Product',
    //         editing:false,
    //         errorMessage: errors.array()[0].msg,
    //         oldInput:{
    //           email:email,
    //           password:password,
    //           confirmPassword:req.body.confirmPassword
    //         },
    //         validationErrors: errors.array(),
    //       });
    // }
    product
        .save()
        .then((result) => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
}

export function getEditProduct(req, res, next) {
    const editMode = Boolean(url.parse(req.url, true).query.edit);
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) res, redirect('/');
            res.render('admin/editProduct', {
                pageTitle: 'Edit Product',
                path: '/admin/addProduct',
                editing: editMode,
                prod: product,
                hasError: false,
                errorMessage: null,
            });
        })
        .catch(err => {
            console.log(err);
        });

}

export function postEditProduct(req, res, next) {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImgUrl = req.body.imgUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(442).render('admin/editProduct', {
            path: '/admin/editProduct',
            pageTitle: 'Edit Product',
            editing: true,
            hasError: true,
            prod: {
                title: updatedTitle,
                imgUrl: updatedImgUrl,
                price: updatedPrice,
                description: updatedDescription,
                _id: prodId,
            },
            errorMessage: errors.array()[0].msg,
        });
    }
    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.description = updatedDescription;
            product.imgUrl = updatedImgUrl;
            product.price = updatedPrice;
            return product.save();
        })
        .then(result => {
            console.log("Updated");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

export function postDeleteProduct(req, res, next) {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}

export function getProducts(req, res, next) {

    Product
        .find()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(err => {
            console.log(err);
        })
}

