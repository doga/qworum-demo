// Checks whether the Qworum extension is running on the end-user's browser.
// Used by check-qworum-availability-LANG.html.

// Use Qworum
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

console.log(`Qworum.version: ${Qworum.version}`);

checkQworumAvailability();

async function checkQworumAvailability() {
  try {
    await Qworum.checkAvailability();
    console.log(`The Qworum browser extension is running !`);

    // Execute a Qworum script
    // (See https://qworum.net/en/specification/v1/#script)
    await Qworum.eval(
      Script(
        // Call the `home` end-point
        Call('@', 'home/')

        // Fault('* test fault')
        // Return(Json('test value'))
      )
    );
  } catch (error) {
    console.log(`Error: ${error}`);

    // Ask the end-user to install Qworum
    document.querySelector('.hide').className = 'show';
  }

}
