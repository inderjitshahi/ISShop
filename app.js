import express from 'express';
import bodyParser from 'body-parser';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import path from 'path';
import dirname from './path.js'
import { get404 } from './controllers/error.js';
import {mongoConnect,getDb} from './utility/database.js';
import { User } from './models/user.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(dirname, 'public')));

app.use((req,res,next)=>{
    User.findByPk('629ac9ada9f559d586f995af')
    .then(user=>{
        req.user= new User(user.name,user.email,user.cart,user._id);
        next();
    })
    .catch(err=>{
        console.log(err);
    })
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use(get404);


mongoConnect(()=>{
    app.listen(3000);
})
