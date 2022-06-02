// import dirname from '../path.js';
import express from 'express';
const router = express.Router();
import {getIndex,getProducts,getProduct,getCheckout,getCart,postCart,getOrders,postCartDelete} from '../controllers/shop.js'

router.get('/', getIndex);

router.get('/products',getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart',postCart);

router.get('/orders', getOrders);

router.get('/checkout',getCheckout);

router.post('/cartDeleteItem',postCartDelete);

export default router;
