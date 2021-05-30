var express = require('express');
var router = express.Router();
const Order = require('../model/ordermodel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async function(req, res, next) {
  const {iduser, products} = req.body;

  if(!iduser || !products){
    console.log('error');
    next();
  }else{
    const order = new Order({iduser, products});
    try{
      await order.save();

      res.json({
        message: 'Order added'
      });
    }catch(ex){
      //req.error = ex.message;
      next(ex);
    }

    
  }
});

module.exports = router;
