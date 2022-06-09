import Product from "../models/product.js";
import Order from "../models/order.js"
import User from "../models/user.js";
import fs from 'fs';
import dirname from "../path.js";
import path from 'path';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe= new Stripe(process.env.STRIPE_API_KEY);
const ITEMS_PER_PAGE = 2;

export function getProducts(req, res, next) {
    const page = Number(req.query.page ? req.query.page : 1);
    let totalItems = 0;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            getCheckout
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            return res.render('shop/productList', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: +page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        })
        .catch(err => {
            next(new Error(err));
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
            next(new Error(err));
        });
}

export function getIndex(req, res, next) {

    const page = Number(req.query.page ? req.query.page : 1);
    let totalItems = 0;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            return res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: +page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        })
        .catch(err => {
            next(new Error(err));
        });
}

export function getCart(req, res, next) {
    // console.log(req.user);
    req.user
        .populate('cart.items.productId')
        .then(user => {
            // console.log(user.cart.items);
            const products = user.cart.items
            // console.log(products);
            return res.render('shop/cart', {
                products: products,
                pageTitle: 'Your Cart',
                path: '/cart',
            });
        })
        .catch(err => {
            next(new Error(err));
        });

};


export function postCart(req, res, next) {
    const prodId = req.body.productId;
    const product = Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => { return res.redirect('/cart'); })
        .catch(err =>next(new Error(err)));
}

export function postCartDelete(req, res, next) {
    const prodId = req.body.productId;
    req.user.removeItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => next(new Error(err)));

}

export function getCheckout(req, res, next){
    // console.log(req.user);
    let products;
    let total = 0;
    req.user
        .populate('cart.items.productId')
        .then(user => {
            // console.log(user.cart.items);
            products = user.cart.items;
            products.forEach(p => {
                total += p.qty * p.productId.price;
            });
            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        name: p.productId.title,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency:'inr',
                        quantity: p.qty,
                    };
                }),
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success', 
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
            });
        })
        .then(session => {
            res.render('shop/checkout', {
                products: products,
                pageTitle: 'Checkout',
                path: '/checkout',
                totalSum: total,
                sessionId: session.id,
            });
        })
        .catch(err => {
            next(new Error(err));
        });

}

export function postOrders(req, res, next) {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { qty: i.qty, productData: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user,
                },
                products: products,
            });
            return order.save();
        })
        .then(result => {
            req.user.clearCart();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => next(new Error(err)));
}

export function getOrders(req, res, next) {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                orders: orders,
                pageTitle: 'Orders',
                path: '/orders',
                isAuthenticated: req.session.isLoggedIn,
            });
        })
}

// function streamFile(invoiceName,invoicePath){}

export function getInvoice(req, res, next) {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            const invoiceName = 'invoice' + '-' + orderId + '.pdf';
            const invoicePath = path.join(dirname, 'data', 'invoices', invoiceName);


            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition',
                'inline;filename="' + invoiceName + '"'
            );

            //Writting into Pdf
            pdfDoc.fontSize(20).text(`OrderID: ${orderId}\n\n`);
            let totalPrice = 0;
            order.products.forEach(p => {
                pdfDoc.fontSize(16).text(p.productData.title +
                    `-` +
                    p.qty +
                    ' x ' +
                    p.productData.price +
                    '\n' +
                    '-----------------------------------' +
                    '\n'
                )
                totalPrice += p.qty * p.productData.price;
            });

            pdfDoc.fontSize(20)
                .text('\n\nTotal Price: ₹' +
                    totalPrice + '/-\n\n', { underline: true, });
            pdfDoc.fontSize(16)
                .text(`Dear Customer,\nThankYou for Shopping With Us!!`);


            pdfDoc.end();

        })
        .catch(err => {
            return next(new Error(err));
        })

    //  fs.readFile(invoicePath,(err,data)=>{
    //         if(err){
    //             return next(err);
    //         }
    //         res.setHeader('Content-Type','application/pdf');
    //         res.setHeader('Content-Disposition','attachment;filename="'+invoiceName+'"');
    //         res.send(data);
    //  });

    /*********************** File Stream ***********************/

    // const file =fs.createReadStream(invoicePath);
    // file.on('error', function(err) {
    //     return next(new Error("Cannt Read File"));
    //   });
    // res.setHeader('Content-Type','application/pdf');
    // res.setHeader('Content-Disposition',
    // 'inline;filename="'+invoiceName+'"'
    // );
    // file.pipe(res);




};


