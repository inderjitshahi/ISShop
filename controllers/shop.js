import { Product } from "../models/product.js";
import { User } from "../models/user.js";

export function getProducts(req, res, next) {
    Product
        .fetchAll()
        .then(products => {
            res.render('shop/productList', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

export function getProduct(req, res, next) {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            console.log(product);
            res.render('shop/productDetail', {
                prod: product,
                pageTitle: 'Details',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

export function getIndex(req, res, next) {
    Product
        .fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

export function getCart(req, res, next) {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                products: products,
                pageTitle: 'Your Cart',
                path: '/cart'
            });
        })
        .catch(err => {
            console.log(err);
        });

    // Cart.fetchAll((cart) => {
    //     Product.fetchAll(products => {
    //         const cartProduct = [];
    //         products.forEach(product => {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cart.products.find(prod => prod.id === product.id)) {
    //                 cartProduct.push({ productData: product, qty: cartProductData.qty });
    //             }
    //         });
    //         // console.log(cartProduct);
    //         res.render('shop/cart', {
    //             products: cartProduct,
    //             pageTitle: 'Your Cart',
    //             path: '/cart'
    //         });

    //     });
    // });

};


export function postCart(req, res, next) {
    const prodId = req.body.productId;
    const product = Product.findByPk(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {res.redirect('/cart');})
        .catch(err => console.log(err));
}


export function postOrders(req, res, next) {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { qty: product.cartItem.qty };
                        return product;
                    }));
                })
                .then(result => {
                    return fetchedCart.setProducts(null);
                })
                .then(result => {
                    res.redirect('/orders');
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
}

export function getOrders(req, res, next) {
    req.user.getOrders({ include: ['products'], })
        .then(orders => {
            res.render('shop/orders', {
                orders: orders,
                pageTitle: 'Orders',
                path: '/orders'
            });
        })
        .then(err => {
            console.log(err);
        })
}

export function postCartDelete(req, res, next) {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then(result=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
    // req.user.getCart()
    //     .then(cart => {
    //         return cart.getProducts({ where: { id: prodId } });
    //     })
    //     .then(products => {
    //         const product = products[0];
    //         product.cartItem.destroy();
    //     })
    //     .then(result => {
    //         
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

}

