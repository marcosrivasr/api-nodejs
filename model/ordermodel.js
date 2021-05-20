const { Mongoose } = require("mongoose");
const UserSchema = require('./usermodel');
const ProductSchema = require('./productmodel');


const OrderSchema = new Mongoose.Schema({
    id: {type: ObjectId},
    iduser: {type: String, required: true, unique: true},
    products: [{id: String, qty: Number}],
    total: {type: Number},
    date: {type: Date, default: Date.now }
});

OrderSchema.pre('save', function(next){
    if(this.isModified('password') || this.isNew){
        const document = this;

        const idUser = document.iduser;
        const products = document.products;

        User.findById(idUser, function (err, user) {
            if (err){
                throw new Error('Error al encontrar usuario');
            }
            console.log(user.name);

            let promises = [];
            for(item of products){
                promises.push(ProductSchema.findById(item.id));
            }

            Promise.all(promises).then(res => {
                console.log(res);
            }).catch( err => {
                throw new Error(err);
            })
        });


    }else{
        next();
    }
});


module.exports = mongoose.model('Order', OrderSchema);