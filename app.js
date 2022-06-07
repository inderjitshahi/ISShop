import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
import path from 'path';
import dirname from './path.js'
import { get404 } from './controllers/error.js';
import User from './models/user.js';
import mongoose from 'mongoose';

import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
const mongoDbStore = connectMongo(session);

import csrf from 'csurf';
import flash from 'connect-flash';



const app = express();

const store = new mongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

const csrfProtection = csrf();
app.use(flash());

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')   //null error
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
})

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    }else{
        callback(null, false);
    }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(dirname, 'public')));

app.use(
    session({
        secret: 'my secret',
        resave: 'false',
        saveUninitialized: false,
        store: store
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    // console.log("hello");
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});



app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);



mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => { console.log(err); });