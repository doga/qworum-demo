// index.html: Qworum checker

// Use Qworum
import { Qworum } from "./modules/qworum/qworum-for-web-pages.mjs";
console.log(`Qworum.version: ${Qworum.version}`);

try {
  Qworum.ping(() => {
    console.log(`pinged`);
  });
} catch (error) {
  console.log(`Error: ${error}`);
}
