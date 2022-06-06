import mongoose from "mongoose";
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    products:[{
       productData:{
           type:Object,
           required:true,
       },
       qty:{
           type:Number,
           required:true,
       } 
    }],
    user:{
        name:{
            type:String,
            required:true,
        },
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"User",
        }
    }
});

export default mongoose.model('Order',orderSchema);