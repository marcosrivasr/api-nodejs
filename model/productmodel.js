const { Mongoose } = require("mongoose");

const ProductSchema = new Mongoose.Schema({
    id: {type: ObjectId, required: true},
    title: {type: String, required: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model('Product', ProductSchema);