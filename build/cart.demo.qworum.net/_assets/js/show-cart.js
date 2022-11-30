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

// Web components
import { MySiteBanner } from "./modules/web-components/site-banner.mjs";
import { MyLineItems } from "./modules/web-components/line-items.mjs";
import { MyCheckoutButton } from "./modules/web-components/checkout-button.mjs";
window.customElements.define('my-site-banner', MySiteBanner);
window.customElements.define('my-line-items', MyLineItems);
window.customElements.define('my-checkout-button', MyCheckoutButton);

// UI

show();

async function show() {
  // Show the line items
  let lineItems = await Qworum.runtime.getData(['@', 'line items']);
  if (lineItems instanceof Qworum.runtime.message.Json) {
    lineItems = lineItems.value;
  } else {
    lineItems = [];
  }
  lineItems = JSON.stringify(lineItems);
  // alert(`lineItems: ${lineItems}`);
  document.querySelector('#line-items').setAttribute('line-items', lineItems);

  // Set up the close button
  document.querySelector('#close').addEventListener('click', async () => {
    // Execute a Qworum script
    await Qworum.runtime.eval(Script(
      Return(Json(0))
    ));
  });

}


