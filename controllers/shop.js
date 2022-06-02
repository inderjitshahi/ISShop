import { Product } from "../models/product.js";
import { Cart } from '../models/cart.js'
export function getProducts(req, res, next) {
    Product.fetchAll((products) => {
        res.render('shop/productList', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
}

export function getProduct(req, res, next) {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/productDetail', {
            prod: product,
            pageTitle: 'Details',
            path: '/products'
        });
    });
}

export function getIndex(req, res, next) {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/index',
        });
    });
}

export function getCart(req, res, next) {
    Cart.fetchAll((cart) => {
        Product.fetchAll(products => {
            const cartProduct = [];
            products.forEach(product => {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cart.products.find(prod => prod.id === product.id)) {
                    cartProduct.push({ productData: product, qty: cartProductData.qty });
                }
            });
            // console.log(cartProduct);
            res.render('shop/cart', {
                products: cartProduct,
                pageTitle: 'Your Cart',
                path: '/cart'
            });

        });
    });
};
export function postCart(req, res, next) {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

export function getOrders(req, res, next) {
    Product.fetchAll((products) => {
        res.render('shop/orders', {
            prods: products,
            pageTitle: 'Orders',
            path: '/orders'
        });
    });
}

export function getCheckout(req, res, next) {
    Product.fetchAll((products) => {
        res.render('shop/checkout', {
            prods: products,
            pageTitle: 'Checkout',
            path: '/checkout'
        });
    });
}

export function postCartDelete(req, res, next) {
    const prodId=req.body.productId;
    Product.findById(prodId,product=>{
        Cart.deleteProduct(prodId,product.price);
        res.redirect('/cart');
    });
}

