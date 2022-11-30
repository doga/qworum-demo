// Qworum library
import { Qworum } from "./modules/qworum/qworum-for-web-pages.mjs";
const
  // Qworum Data value types
  Json = Qworum.runtime.Json,
  SemanticData = Qworum.runtime.SemanticData,
  // Qworum instructions
  Data = Qworum.runtime.Data,
  Return = Qworum.runtime.Return,
  Sequence = Qworum.runtime.Sequence,
  Goto = Qworum.runtime.Goto,
  Call = Qworum.runtime.Call,
  Fault = Qworum.runtime.Fault,
  Try = Qworum.runtime.Try,
  // Qworum script
  Script = Qworum.runtime.Script;

// Update the cart.
// IMPORTANT: Code that runs automatically on page load must be delayed, so that only the last page in the tab history is processed.
setInterval(updateCart, 500);

async function updateCart() {
  let lineItemsToAdd = await Qworum.runtime.getData('line items to add');

  // Validate the call parameter
  if (!(lineItemsToAdd && lineItemsToAdd instanceof Qworum.runtime.message.Json && lineItemsToAdd.value instanceof Array)) { // TODO deep data validation
    await Qworum.runtime.eval(Script(
      Fault('* the "line items to add" call parameter is missing or invalid')
    ));
    return;
  }
  lineItemsToAdd = lineItemsToAdd.value;

  // Update the cart
  let lineItems = await Qworum.runtime.getData(['@', 'line items']);

  if (lineItems instanceof Qworum.runtime.message.Json) {
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
  const totalCents =
    lineItems.reduce(
      (totalCents, lineItem) => totalCents + Math.trunc(lineItem.price.EUR * 100) * lineItem.count,
      0
    );

  if (await Qworum.runtime.setData(['@', 'line items'], Json(lineItems))) {
    if (await Qworum.runtime.setData(['@', 'total'], Json({ EUR: totalCents / 100 }))) {
      // show the cart
      // window.location.replace('../show-cart/');
      await Qworum.runtime.eval(Script(
        Call('@', '../show-cart/')
      ));
    } else {
      await Qworum.runtime.eval(Script(
        Fault('* the total was not updated')
      ));
    }
  } else {
    await Qworum.runtime.eval(Script(
      Fault('* the line items list was not updated')
    ));
  }

}
