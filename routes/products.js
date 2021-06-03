var express = require('express');
var router = express.Router();
const Product = require('../model/productmodel');
const authMiddleware = require('../auth/auth.middleware');
const createError = require('http-errors');
const {jsonResponse} = require('../lib/jsonresponse');
const { create } = require('../model/productmodel');

router.get('/', authMiddleware.checkAuth, async function(req, res, next) {
  let results={};

  try{
    results = await Product.find({}, 'title price');
  }catch(ex){
    next(createError(400, `Error fetching the results`))
  }

  res.json(jsonResponse(200, {
    results
  }));
});

router.post('/', authMiddleware.checkAuth, async function(req, res, next) {
  console.log(req.body);
  const {title, price} = req.body;

  if(!title || !price){
    return next(createError(400, `Error registering product, provide all the information`));
  }else{
    const product = new Product({title, price});

      try{
        await product.save();

        res.json(jsonResponse(200, {
          message: "Product added successfully"
        }));
      }catch(ex){
        console.log(ex);
        next(createError(500, `Error trying to register the products. Try again`));
      }
    
  }
});

router.get('/:idproduct',authMiddleware.checkAuth, async function(req, res, next) {
  let results;

  const {idproduct} = req.params;

  if(!idproduct) return next(createError(400, `No Id provided`));

  try{
    results = await Product.findById(req.params.idproduct, 'id title price');
  }catch(ex){
    next(createError(500, `Id incorrect. Try again`));
  }

  res.json(jsonResponse(200,
    results));
});

router.patch('/:idproduct', authMiddleware.checkAuth, async function(req, res, next) {
  let update = {};

  const {idproduct} = req.params;
  const {title, price} = req.body;


  
  if(!idproduct) return next(createError(400, `No product id provided`));

  if(!title && !price) return next(createError(400, `No product information found to update`));

  if(title) update['title'] = title;
  if(price) update['price'] = price; 

  try{
    await Product.findByIdAndUpdate(idproduct, update);

    res.json(jsonResponse(200, {
      message: `Product ${idproduct} updated successfully`
    }))
  }catch(ex){
    return next(createError(500, `Error trying to update product ${idproduct}`))
  }

});

router.delete('/', authMiddleware.checkAuth, async (req, res, next) => {
  const {id} = req.body;

  if(!id) return next(createError(400, `No id provided`));

  try{
    const result = await Product.findByIdAndDelete(id);
    
    if(!result) return next(createError(400, `The product to delete does not exist`));
  }catch(ex){
    next(createError(500, `Error trying to delete product ${id}`));
  }

  res.json(jsonResponse(200, {
    message: `Product ${id} deleted successfully`
  }))

});


module.exports = router;
