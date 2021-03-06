# AgileEngine Transaction Project

## Introduction
Code Challenge for AgileEngine. Author: Mario Romero

https://www.linkedin.com/in/mario-romero-arg/

http://www.marioromero.com.ar

### Installation
Nodejs 9.x (or higher) environment is required

```bash
git clone https://github.com/maaroarg/agileEngineTest
npm install
```

### Getting started

You can start each module separately

```bash
npm run server
npm run http-server
```
... or you can start both!

```bash
npm start
```

### API
http://localhost:3000/transactions/ [GET/POST]

### Transaction Model
```bash
{
type*	string
  Enum:
      [ credit, debit ]
amount*	number
  Transaction numeric value. Incrementing or decrementing the account balance, based on the transaction type.
}
```

http://localhost:3000/transactions/:tid [GET]

### FrontEnd
http://localhost:5000/
