// index.html: Qworum checker

// Use Qworum
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

console.log(`Qworum.version: ${Qworum.version}`);

try {
  Qworum.ping(() => {
    console.log(`Found Qworum extension !`);
  });
} catch (error) {
  console.log(`Error: ${error}`);
  document.querySelector('.hide').className = 'show';
}
