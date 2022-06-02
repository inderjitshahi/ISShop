import express from 'express';
import bodyParser from 'body-parser';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import path from 'path';
import dirname from './path.js'
import { get404 } from './controllers/error.js';


const app=express();

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(dirname,'public')));

app.use(adminRoutes); 

app.use(shopRoutes);

app.use(get404);

// const server = createServer(app);
// server.listen(3000);
app.listen(3000);