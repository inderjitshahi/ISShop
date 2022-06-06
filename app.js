import express from 'express';
import bodyParser from 'body-parser';
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

const MONGODB_URI='mongodb+srv://inderjitshahi:ZDUWg0gH3mg7tAoP@cluster0.urwqb.mongodb.net/shop?retryWrites=true';

const app = express();

const store=new mongoDbStore({
    uri:MONGODB_URI,
    collection:'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(dirname, 'public')));

app.use(
    session({secret:'my secret', resave:'false', saveUninitialized:false, store:store})
);


app.use((req, res, next) => {
    User.findById("629be0cb94afdb958b5cd569")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);



mongoose
    .connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: "Max",
                    email: "test.gamil.com",
                    cart: {
                        items: [],
                    },
                })
                return user.save();
            }
        })
        .catch(err => {
                console.log(err);
            })
        console.log("Connected");
        app.listen(3000);
    })
    .catch(err => { console.log(err); });