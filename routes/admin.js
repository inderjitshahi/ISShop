// import dirname from '../path.js'
import express from 'express';
import { getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct, deleteProduct } from '../controllers/admin.js'
import isAuth from '../middleware/isAuth.js'
import { check } from 'express-validator';


const router = express.Router();

// /admin/addProduct => Get
router.get('/admin/addProduct', isAuth, getAddProduct);

// /admin/products => Get
router.get('/admin/products', isAuth, getProducts);

// /admin/addProduct => Post
router.post('/admin/addProduct',[
    check('title',"Enter a Valid Title")
    .isString()
    .isLength({min:3})
    .trim(),
    check('price',"Enter a Valid Price")
    .isFloat()
    .trim(),
    check('description',"Enter a Valid Description")
    .isLength({min:5,max:255})
    .trim(),
],isAuth ,postAddProduct);

router.get('/admin/editProduct/:productId', getEditProduct);

router.post('/admin/editProduct',[
    check('title',"Enter a Valid Title")
    .isString()
    .isLength({min:3})
    .trim(),
    check('price',"Enter a Valid Price")
    .isFloat()
    .trim(),
    check('description',"Enter a Valid Description")
    .isLength({min:5,max:255})
    .trim(),
],isAuth ,postEditProduct);

router.delete('/admin/product/:productId',deleteProduct);

export default router;
