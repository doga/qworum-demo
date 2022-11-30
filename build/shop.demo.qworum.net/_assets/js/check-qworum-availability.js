// Checks whether the Qworum extension is running on the end-user's browser.
// Used by check-qworum-availability-LANG.html.

// Use Qworum
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

//console.log(`Qworum.version: ${Qworum.version}`);

checkQworumAvailability();

async function checkQworumAvailability() {
  try {
    await Qworum.ping();
    console.log(`The Qworum browser extension is running !`);

    // Execute a Qworum script
    // (See https://qworum.net/en/specification/v1/#script)
    await Qworum.runtime.eval(
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
