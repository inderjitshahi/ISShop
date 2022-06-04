import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
let _db;

export const mongoConnect=(callback)=>{
    MongoClient.connect('mongodb+srv://inderjitshahi:ZDUWg0gH3mg7tAoP@cluster0.urwqb.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected');
            _db=client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
        });  
};

export const getDb=()=>{
    if(_db) return _db;
    throw "No Database Found!"
}

