var express = require('express');
var router = express.Router();
const Order = require('../model/ordermodel');
const createError = require('http-errors');
const {jsonResponse} = require('../lib/jsonresponse');
const authMiddleware = require('../auth/auth.middleware'); 


router.get('/', authMiddleware.checkAuth, async function(req, res, next) {
  
  try{
    const results = await Order.find({},'id, iduser total date products ');

    res.json(jsonResponse(200, results))

  }catch(ex){
    console.log(ex);
    next(createError(500, `Error trying to fetch the orders`))
  }
});

router.post('/', authMiddleware.checkAuth, async function(req, res, next) {
  const {iduser, products} = req.body;

  if(!iduser || !products){
    return next(createError(400, `No information provided to create order`));
  }else if(iduser && products && products.length > 0){

    const order = new Order({iduser, products});
    try{
      const result = await order.save();

      res.json(jsonResponse(200,
        {message: `Order ${result._id} added successfully`}));
    }catch(ex){
      //req.error = ex.message;
      next(ex);
    }

    
  }else{
    return next(createError(400, `Information incomplete. Provide all the information to create the order`));
  }
});

module.exports = router;
