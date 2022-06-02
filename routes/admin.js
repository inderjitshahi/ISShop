// import dirname from '../path.js'
import express from 'express';
import { getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct } from '../controllers/admin.js'


const router = express.Router();

// /admin/addProduct => Get
router.get('/admin/addProduct', getAddProduct);

// /admin/products => Get
router.get('/admin/products', getProducts);

// /admin/addProduct => Post
router.post('/admin/addProduct', postAddProduct);

router.get('/admin/editProduct/:productId', getEditProduct);

router.post('/admin/editProduct', postEditProduct);

router.post('/admin/deleteProduct', postDeleteProduct);

export default router;
