/*********************************************************************
 ** modules/db.js
 **
 ** Emulates a database storage with an in-memory object and declare functions
 ** to access data
 **
 ** trxModel = {
 **   id: "string",
 **   type: "credit/debit",
 **   amount: "0",
 **   effectiveDate: "timestamp"
 ** }
 *********************************************************************/

const uuidv4 = require('uuid/v4') //Generate Unique User Id
const events = require('events');

const ee = new events.EventEmitter();

//Storage emulation
const data = {
 account_balance: 0,
 history:[],
 access: true
}

/*********************************************************************
 ** getAccess:
 ** Control access to data shared resource implementing a Mutex lock.
 *********************************************************************/
const getAccess = mod => new Promise((resolve, reject)=>{

  if(data.access){
    if(mod=='r') return resolve(); //read access won't lock

    data.access = false;
    console.log('MUTEX getAccess directly');
    return resolve();
  }

  const tryAccess = ()=>{
      if(data.access){
        data.access = false;
        ee.removeListener('release', tryAccess);
        console.log('MUTEX getAccess after event');
        return resolve();
      }
      ee.on('release', tryAccess);
  }
})

/*********************************************************************
 ** releaseAccess:
 ** Release shared resource lock emmiting 'release' event
 *********************************************************************/
const releaseAccess = () => {
  console.log('MUTEX release');
  data.access = true;
  setImmediate(()=>ee.emit('release'));
}

/*********************************************************************
 ** getTransactionHistory:
 ** return Array
 *********************************************************************/
const getTransactionHistory = () => new Promise((resolve, reject)=> resolve(data.history));

/*********************************************************************
 ** getTransactionById:
 ** return Object
 *********************************************************************/
const getTransactionById = id => new Promise((resolve, reject)=>{
  const res = data.history.find(trx=>id===trx.id)
  if(res)
    resolve(res);
  else
    reject();
})

/*********************************************************************
 ** commitTransaction:
 **
 *********************************************************************/
const commitTransaction = (type, amount) => new Promise((resolve, reject)=>{

  if(type=='debit' && data.account_balance - amount < 0)
    throw "Negative Account Balance"; //TODO improve Exception flow

  switch (type) {
    case 'debit':
      data.account_balance -= amount;
      break;
    case 'credit':
      data.account_balance += amount;
      break;
  }

  const newTrx = {id:uuidv4(), type, amount, effectiveDate: new Date().toUTCString()};
  data.history.push(newTrx);
  console.log("account_balance", data.account_balance);
  return resolve(newTrx);
})

/*********************************************************************
 ** init:
 ** Just populate the data object for testing...
 *********************************************************************/
const init = () => {
  commitTransaction('credit', 100);
  commitTransaction('credit', 100);
  commitTransaction('credit', 100);
  commitTransaction('debit', 100);
  commitTransaction('debit', 50);
  console.log('AMOUNT', data.account_balance);
}

module.exports = {
  init,
  getAccess,
  releaseAccess,
  getTransactionHistory,
  getTransactionById,
  commitTransaction
}
