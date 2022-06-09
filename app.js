import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import multer from 'multer';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
import path from 'path';
import dirname from './path.js'
import { get404, get500 } from './controllers/error.js';
import User from './models/user.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compress from 'compression';
import morgan from 'morgan';


dotenv.config();

import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
const mongoDbStore = connectMongo(session);

import csrf from 'csurf';
import flash from 'connect-flash';
import { Stream } from 'stream';

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

const accessLogStream =fs.createWriteStream(path.join(dirname,'access.log'),{flags:'a'});

app.use(helmet());
app.use(compress());
app.use(morgan('combined',{stream:accessLogStream}));


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
    } else {
        callback(null, false);
    }
}

//making View folder available wihtout using absolute path
app.set('view engine', 'ejs');
app.set('views', 'views');

// Multer MiddleWare
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

//Body parser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));


//Making assets in public folder usable in view folder
app.use(express.static(path.join(dirname, 'public')));
app.use('/images',express.static(path.join(dirname, 'images')));

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
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


//Executing this Route for every incomming request before all routes
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err)); //use next for asunc code to throw error
        });
});





app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);


//General Error handling middleware
app.use((error, req, res, next) => {
    // res.redirect('/500');
    console.log(error);
    res.status(404).render('500', {
        path: '',
        pageTitle: 'Error',
        isAuthenticated: req.session.isLoggedIn,
    });
});



mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => { console.log(err); });