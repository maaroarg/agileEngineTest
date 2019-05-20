/*********************************************************************
 ** app/index
 **
 ** Creates the App Server. Setup Routes and Middlewares
 **
 *********************************************************************/

const bodyParser = require('body-parser');
const helmet = require('helmet');
const logger = require('./middlewares/logger');
global.db = require('./modules/db');
const express = require('express');
const asyncify = require('express-asyncify');

const app = asyncify(express());
const port = 3000;

//Set Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

//CORS support
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "POST, GET, PUT, DELETE, OPTIONS, HEAD, authorization,Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Routes
const transactions = require('./routes/transactions');
app.use('/transactions', transactions);

//Welcome Message
const msg = `
<h1>Agile Engine TRX API Server</h1>
<hr/>
<pre>
  GET /transactions/
  GET /transactions/:id
  POST /transactions {type:"credit/debit" amount:Number}
</pre>
`
app.get('/', (req, res) => res.send(msg));

//Express Error Handler
app.use((err, req, res, next) => {
  console.log(`Error: ${err.message}`);
  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message });
  }
  res.status(500).send({ error: err.message });
})

//Testing...
//global.db.init();

//Starting Server...
app.listen(port, () => console.log(`Server running port: ${port}`));
