/*********************************************************************
 ** Webapp, JS Vanilla version.
 **
 *********************************************************************/


(function(){
  const btn = document.querySelector('button');
  const listContainer = document.querySelector('div#accordion');

  document.addEventListener('DOMContentLoaded', getTransactionList);
  btn.addEventListener('click', getTransactionList);

  function getTransactionList(){
      fetch('http://localhost:3000/transactions')
      .then(response=>response.json())
      .then(transactions=>{
        console.log(transactions);
        if(transactions.length > 0) {
          listContainer.innerText = "";
          buildTransactionList(transactions);

        }
      })
  }

  function buildTransactionList(trx){

      const colorClass = {
        credit: 'credit-color',
        debit: 'debit-color'
      }

      trx.forEach((t,index)=>{

        listContainer.innerHTML += `
        <div class="card">
          <div class="card-header" id="heading${index}">
            <h5 class="mb-0">
              <button class="btn btn-link ${colorClass[t.type]}" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                Type: ${t.type} Amount: ${t.amount}
              </button>
            </h5>
          </div>

          <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#accordion">
            <div class="card-body">
              <pre>
                id: ${t.id}
                type: ${t.type}
                amount: ${t.amount}
                date: ${t.effectiveDate}
              </pre>
            </div>
          </div>
        </div>
        `
      })
  }

})();
