// Qworum library
// import { Qworum } from "./modules/qworum/qworum-for-web-pages.mjs";
import { Qworum } from "https://cdn.skypack.dev/@qworum/qworum-for-web-pages@1.0.9";
// import { Qworum } from "https://cdn.skypack.dev/pin/@qworum/qworum-for-web-pages@v1.0.9-nzYMp2BgqXdEyoY7FP9r/mode=imports,min/optimized/@qworum/qworum-for-web-pages.js";
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
  let lineItems = await Qworum.getData(['@', 'line items']);
  if (lineItems instanceof Qworum.message.Json) {
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
    await Qworum.eval(Script(
      Return(Json(0))
    ));
  });

}


