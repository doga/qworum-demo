// Checks whether the Qworum extension is running on the end-user's browser.
// Used by check-qworum-availability-LANG.html.

// Use Qworum
import { Qworum } from "https://esm.sh/gh/doga/qworum-for-web-pages@1.2.0/mod.mjs";

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

    // This is a workaround for the "prefetching" of this page by browsers.
    // Prefetching doesn't work with Qworum, because during prefetching the document.location URL does not point the actual page URL, but it points to whatever page the browser happens to be on when it does the prefetching.
    setInterval(() => location.reload(), 3000);
    
  }

}
