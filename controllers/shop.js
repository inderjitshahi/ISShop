import Product from "../models/product.js";
import Order from "../models/order.js"
import User from "../models/user.js";

export function getProducts(req, res, next) {
    Product
        .find()
        .then(products => {
            res.render('shop/productList', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
            });
        })
        .catch(err => {
            console.log(err);
        });
}

export function getProduct(req, res, next) {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/productDetail', {
                prod: product,
                pageTitle: 'Details',
                path: '/products',
            });
        })
        .catch(err => {
            console.log(err);
        });
}

export function getIndex(req, res, next) {
    Product
        .find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
            });
        })
        .catch(err => {
            console.log(err);
        });
}

export function getCart(req, res, next) {
    // console.log(req.user);
    req.user
        .populate('cart.items.productId')
        .then(user => {
            // console.log(user.cart.items);
            const products = user.cart.items
            res.render('shop/cart', {
                products: products,
                pageTitle: 'Your Cart',
                path: '/cart',
            });
        })
        .catch(err => {
            console.log(err);
        });

};


export function postCart(req, res, next) {
    const prodId = req.body.productId;
    const product = Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => { res.redirect('/cart'); })
        .catch(err => console.log(err));
}

export function postCartDelete(req, res, next) {
    const prodId = req.body.productId;
    req.user.removeItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

}

export function postOrders(req, res, next) {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i=>{
                return {qty:i.qty, productData:{...i.productId._doc}};
            });
            const order = new Order({
                user:{
                    email:req.user.email,
                    userId:req.user,
                },
                products:products,
        });
        return order.save();
    })
    .then(result=>{
        req.user.clearCart();
    })
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>console.log(err));
}

export function getOrders(req, res, next) {
    Order.find({'user.userId':req.user._id})
    .then(orders=>{
        res.render('shop/orders', {
            orders: orders,
            pageTitle: 'Orders',
            path: '/orders',
            isAuthenticated:req.session.isLoggedIn,
        });
    })
}



