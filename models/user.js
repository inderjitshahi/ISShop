import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            }, qty: {
                type: Number,
                required: true,
            }
        }]
    },
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQty = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        //Prodyct already exits, just update qty
        newQty = this.cart.items[cartProductIndex].qty + 1;
        updatedCartItems[cartProductIndex].qty = newQty;
    }
    else {
        updatedCartItems.push({ productId: product._id, qty: newQty });
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();

};

userSchema.methods.removeItemFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items=updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart= {item:[]};
    return this.save();
}

export default mongoose.model("User", userSchema);














// import { getDb,mongoConnect } from "../utility/database.js";
// import mongodb, { ObjectId } from "mongodb";



// export class User{
//     constructor(username,email,cart,_id){
//         this.username=username;
//         this.email=email;
//         this.cart=cart;  //{items:[{...product},qty]}
//         this._id=new mongodb.ObjectId(_id);
//     }

//     save(){
//         const db=getDb();
//         return db.collection('users')
//         .insertOne(this);
//     }

//     addToCart(product){
//         const db=getDb();
//         console.log(this.cart.items[0].productId);
//         const cartProductIndex=this.cart.items.findIndex(cp=>{
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQty=1;
//         const updatedCartItems =[...this.cart.items];
//         if(cartProductIndex>=0){
//             //Prodyct already exits, just update qty
//             newQty=this.cart.items[cartProductIndex].qty+1;
//             updatedCartItems[cartProductIndex].qty=newQty;
//         }
//         else{
//             updatedCartItems.push({productId:new mongodb.ObjectId(product._id),qty:newQty});
//         }
//         const updatedCart={items:updatedCartItems};
//         return db.collection('users')
//        .updateOne({_id:this._id},{$set:{cart:updatedCart}});

//     }

//     getCart(){
//         const db=getDb();
//         const productIds=this.cart.items.map(item=>{
//             return item.productId;
//         });

//         return db.collection('products').
//         find({_id:{$in:productIds}})
//         .toArray()
//         .then(products=>{
//             return products.map(p=>{
//                 return {...p,qty:this.cart.items.find(i=>i.productId.toString() === p._id.toString()).qty};
//             })
//         })
//         .catch(err=>console.log(err))
//         return this.cart;
//     }

//     static findByPk(id){
//         const db=getDb();
//         return db.collection('users')
//         .findOne({
//             _id: new mongodb.ObjectId(id),
//         });
//     }

//     deleteItemFromCart(productId){
//         const db=getDb();
//         const updatedCartItems=this.cart.items.filter(item=>{
//             return item.productId.toString() !== productId.toString();
//         });

//         return db.collection('users')
//        .updateOne({_id:this._id},{$set:{cart:{items:updatedCartItems}}});
//     }

//     static fetchAll(){
//         const db=getDb();
//         return db.collection('users')
//         .find()
//         .toArray()
//         .then(users=>{
//             // console.log(users);
//             return users;
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }
// };