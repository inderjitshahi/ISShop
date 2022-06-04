import { getDb ,mongoConnect } from "../utility/database.js";
import mongodb from 'mongodb';


export class Product{
    constructor(title,price,imgUrl,description,_id,userId){
        this.title=title;
        this.price=price;
        this.imgUrl=imgUrl;
        this.description=description;
        if(_id) this._id=new mongodb.ObjectId(_id);
        this.userId=userId;
    }

    save(){
        const db=getDb();
        let dbOp;
        if(this._id){
            //update the product with same id
           dbOp= db.collection('products')
           .updateOne({_id:this._id},{$set:this});
        }else{
            //new product
            dbOp=db.collection('products')
            .insertOne(this);
        }
       return dbOp;
    }

    static fetchAll(){
        const db=getDb();
        return db.collection('products')
        .find()
        .toArray()
        .then(products=>{
            // console.log(products);
            return products;
        })
        .catch(err=>{
            console.log(err);
        }); 
    }
    static findByPk(id){
        const db=getDb();
        return db.collection('products')
        .find({
            _id:mongodb.ObjectId(id),
        })
        .next()
        .then(product=>{
            // console.log(product);
            return product;
        })
        .catch(err=>{
            console.log(err);
        }); 
    }
    static deleteById(id){
        const db=getDb();
        return db.collection('products')
        .deleteOne({
            _id: new mongodb.ObjectId(id),
        })
        .then(result=>{
            console.log('Deleted');
        })
        .catch(err=>{
            console.log(err);
        }); 
    }
};