const Mongoose = require("mongoose");

const ProductSchema = new Mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
});

module.exports = Mongoose.model('Product', ProductSchema);