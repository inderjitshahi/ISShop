// import dirname from '../path.js';
import express from 'express';
const router = express.Router();
import { getIndex, getProducts, getProduct, getCart, postCart, getOrders, postCartDelete, postOrders, getInvoice,getCheckout } from '../controllers/shop.js'
import isAuth from '../middleware/isAuth.js'


router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart',isAuth, getCart);

router.post('/cart', postCart);

router.get('/orders',isAuth, getOrders);



router.post('/cartDeleteItem',postCartDelete);
router.get('/orders/:orderId',isAuth,getInvoice);

router.get('/checkout',isAuth,getCheckout)
router.get('/checkout/success',postOrders)
router.get('/checkout/cancel',getCheckout)

export default router;
