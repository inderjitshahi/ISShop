// import dirname from '../path.js';
import express from 'express';
const router = express.Router();
import {getIndex,getProducts,getProduct,getCart,postCart,getOrders,postCartDelete,postOrders} from '../controllers/shop.js'

router.get('/', getIndex);

router.get('/products',getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart',postCart);

router.get('/orders', getOrders);

router.post('/createOrders', postOrders);


router.post('/cartDeleteItem',postCartDelete);

export default router;
