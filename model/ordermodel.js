const Mongoose = require("mongoose");
const User = require('./usermodel');
const Product = require('./productmodel');


const OrderSchema = new Mongoose.Schema({
    iduser: {type: String, required: true},
    products: [{idproduct: String, title: String, price: Number, qty: Number}],
    total: {type: Number, default: 0},
    date: {type: Date, default: Date.now }
});

OrderSchema.pre('save', async function(next){
    if(this.isModified('products') || this.isNew){
        const document = this;
        const idUser = document.iduser;
        const products = document.products;

        document.total = 0;

        let user;
        let promises = [];

        try{
            user = await User.findById(idUser);
        }catch(ex){
            next(new Error(`The user with ID '${idUser}' does not exist`));
            //next(ex);
        }

        try{
            if(products.length == 0){
                //products list is empty
                next(new Error('Order cannot be empty. Add some products to continue'));
            }else{
                for(item of products){
                    promises.push(Product.findById(item.idproduct));
                }
    
                const resultPromises = await Promise.all(promises);
    
                console.log('res promises',resultPromises);
    
                resultPromises.forEach( (product, index) => {
                    document.total += product.price;
                    document.products[index].title = product.title;
                    document.products[index].price = product.price;
                });
            }
            
        }catch(ex){
            next(new Error(`Information of one or more products is incorrect`));
        }

        
    }else{
        next();
    }
});



module.exports = Mongoose.model('Order', OrderSchema);