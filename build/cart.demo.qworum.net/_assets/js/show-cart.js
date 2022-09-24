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

// Web components
import { MySiteBanner } from "./modules/web-components/site-banner.mjs";
import { MyLineItems } from "./modules/web-components/line-items.mjs";
import { MyCheckoutButton } from "./modules/web-components/checkout-button.mjs";
window.customElements.define('my-site-banner', MySiteBanner);
window.customElements.define('my-line-items', MyLineItems);
window.customElements.define('my-checkout-button', MyCheckoutButton);

// UI

// Show the line items
Qworum.getData(['@', 'line items'], (lineItems) => {
  if(lineItems instanceof Qworum.message.Json){
    lineItems = lineItems.value;
  } else {
    lineItems = [];
  }
  lineItems = JSON.stringify(lineItems);
  // alert(`lineItems: ${lineItems}`);
  document.querySelector('#line-items').setAttribute('line-items', lineItems);
});

// Set up the close button
document.querySelector('#close').addEventListener('click', () => {
  // Execute a Qworum script
  Qworum.eval(Script(
    Return(Json(0))
  ));
});


