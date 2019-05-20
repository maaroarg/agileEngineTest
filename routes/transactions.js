const router = require('express').Router();

//Get all transactions history
router.get('/', async (req, res)=>{
  global.db.getAccess('r')
  .then(()=>global.db.getTransactionHistory())
  .then(history=>res.send(history))
  .catch(err=>{
      global.db.releaseAccess();
      res.status('500').send(`Error getting history... ${err}`)
  });
})

//Get TRX by id
router.get('/:id', async (req,res)=>{
  global.db.getAccess('r')
  .then(trx=>global.db.getTransactionById(req.params.id))
  .then(trx=>res.send(trx))
  .catch(err=>{
      res.status('404').send(`Error getting TRX...Not found`)
  });
})

//Commit transaction
router.post('/', async (req, res)=>{

  if(!req.body.amount){
    return res.status('400').send('Missing amount');
  }else if(isNaN(req.body.amount) || req.body.amount < 0){
    return res.status('400').send('Wrong amount:' + req.body.amount);
  }

  if(!req.body.type){
    return res.status('400').send('Missing type');
  }else if((req.body.type!='credit' && req.body.type!='debit')){
    return res.status('400').send('Wrong type:'+req.body.type);
  }

  global.db.getAccess('w')
  .then(()=>global.db.commitTransaction(req.body.type, Number(req.body.amount)))
  .then(data=>res.send(data))
  .then(()=>global.db.releaseAccess())
  .catch(err=>{
      global.db.releaseAccess();
      res.status('400').send(`Error commiting trx... ${err}`);
  });
})

module.exports = router;
