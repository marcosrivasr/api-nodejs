var express = require('express');
var router = express.Router();
const Product = require('../model/productmodel');
const authMiddleware = require('../auth/auth.middleware');

router.get('/', authMiddleware.checkAuth, async function(req, res, next) {
  let results;

  try{
    results = await Product.find({}, '_id title price');
  }catch(ex){
    next(ex)
  }

  res.json(results);
});

router.post('/', async function(req, res, next) {
  console.log(req.body);
  const {title, price} = req.body;

  if(!title || !price){
    console.log('error');
    next();
  }else{
    const product = new Product({title, price});

      await product.save();

      res.json({
        message: 'Product added'
      });
    
  }
});

router.get('/:idproduct', async function(req, res, next) {
  let results;

  try{
    results = await Product.findById(req.params.idproduct, '_id title price');
  }catch(ex){
    next()
  }

  res.json(results);
});

router.patch('/:idproduct', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
