// Qworum library
import { Qworum } from "./modules/qworum/qworum-for-web-pages.mjs";
const
// Qworum Data value types
Json         = Qworum.Json,
SemanticData = Qworum.SemanticData,
// Qworum instructions
Data         = Qworum.Data,
Return       = Qworum.Return,
Sequence     = Qworum.Sequence,
Goto         = Qworum.Goto,
Call         = Qworum.Call,
Fault        = Qworum.Fault,
Try          = Qworum.Try,
// Qworum script
Script       = Qworum.Script;

// Update the cart.
// IMPORTANT: Code that runs automatically on page load must be delayed, so that only the last page in the tab history is processed.
setInterval(updateCart, 500); 

function updateCart() {
  Qworum.getData('line items to add', (lineItemsToAdd) => {
    // Validate the call parameter
    if (!(lineItemsToAdd && lineItemsToAdd instanceof Qworum.message.Json && lineItemsToAdd.value instanceof Array)) { // TODO deep data validation
      Qworum.eval(Script(
        Fault('* the "line items to add" call parameter is missing or invalid')
      ));
      return;
    }
    lineItemsToAdd = lineItemsToAdd.value;

    // Update the cart
    Qworum.getData(['@', 'line items'], (lineItems) => {
      if(lineItems instanceof Qworum.message.Json){
        lineItems = lineItems.value;
      } else {
        lineItems = [];
      }
      // lineItems = lineItems.concat(lineItemsToAdd);
      
      for (const lineItemToAdd of lineItemsToAdd) {
        const lineItem = lineItems.find(li => li.id === lineItemToAdd.id);
        if (lineItem) {
          lineItem.count += lineItemToAdd.count;
        } else {
          lineItems.push(lineItemToAdd);
        }
      }

      // Compute the cart total in euro cents
      let totalCents = 0;
      for (const lineItem of lineItems) {
        totalCents += Math.trunc(lineItem.price.EUR * 100) * lineItem.count;
      }

      Qworum.setData(['@', 'line items'], Json(lineItems), (success) => {
        if(!success){
          Qworum.eval(Script(
            Fault('* the line items was not updated')
          ));
          return;
        }

        Qworum.setData(['@', 'total'], Json({EUR: totalCents / 100}), (success) => {
          if(!success){
            Qworum.eval(Script(
              Fault('* the total was not updated')
            ));
            return;
          }

          // show the cart
          // window.location.replace('../show-cart/');
          Qworum.eval(Script(
            Call('@', '../show-cart/')
          ));
        });
      });

    });

  });

}
