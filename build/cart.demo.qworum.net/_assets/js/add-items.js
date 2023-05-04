// Qworum library
import { Qworum } from "https://cdn.skypack.dev/@qworum/qworum-for-web-pages@1.0.11";
const
// Qworum Data value types
Json         = Qworum.Json,
SemanticData = Qworum.SemanticData,
// Qworum instructions
Data     = Qworum.Data,
Return   = Qworum.Return,
Sequence = Qworum.Sequence,
Goto     = Qworum.Goto,
Call     = Qworum.Call,
Fault    = Qworum.Fault,
Try      = Qworum.Try,
// Qworum script
Script = Qworum.Script;

// Update the cart.
// IMPORTANT: Code that runs automatically on page load must be delayed, so that only the last page in the tab history is processed.
setInterval(updateCart, 500);

async function updateCart() {
  let lineItemsToAdd = await Qworum.getData('line items to add');

  // Validate the call parameter
  if (!(lineItemsToAdd && lineItemsToAdd instanceof Qworum.message.Json && lineItemsToAdd.value instanceof Array)) { // TODO deep data validation
    await Qworum.eval(Script(
      Fault('* the "line items to add" call parameter is missing or invalid')
    ));
    return;
  }
  lineItemsToAdd = lineItemsToAdd.value;

  // Update the cart
  let lineItems = await Qworum.getData(['@', 'line items']);

  if (lineItems instanceof Qworum.message.Json) {
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

  await Qworum.setData(['@', 'line items'], Json(lineItems));
  await Qworum.setData(['@', 'total'], Json({ EUR: totalCents / 100 }));
  // show the cart
  await Qworum.eval(Script(
    Call('@', '../show-cart/')
  ));

  // if (await Qworum.setData(['@', 'line items'], Json(lineItems))) {
  //   if (await Qworum.setData(['@', 'total'], Json({ EUR: totalCents / 100 }))) {
  //     // show the cart
  //     await Qworum.eval(Script(
  //       Call('@', '../show-cart/')
  //     ));
  //   } else {
  //     await Qworum.eval(Script(
  //       Fault('* the total was not updated')
  //     ));
  //   }
  // } else {
  //   await Qworum.eval(Script(
  //     Fault('* the line items list was not updated')
  //   ));
  // }

}
