// Qworum library
import { Qworum } from "@@library";
//console.log(`Qworum.version: ${Qworum.version}`);
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

// Application data
import { articles } from "./modules/articles.mjs";
//console.log(`articles: ${JSON.stringify(articles)}`);

// Web components
import { MyArticle } from "./modules/web-components/article.mjs";
import { MySiteBanner } from "./modules/web-components/site-banner.mjs";
window.customElements.define('my-article', MyArticle);
window.customElements.define('my-site-banner', MySiteBanner);

// UI
show();

async function show() {
  await displayTheArticlesOnSale();
  await displayCartTotal();
}

async function displayCartTotal() {
  let total;
  try {
    total = await Qworum.getData(['@', 'shopping cart', 'total']);
  } catch (error) {
    // data not set
  }

  if (total instanceof Qworum.message.Json) {
    total = total.value.EUR;
  } else {
    total = 0.0;
  }

  document.querySelector('#banner').setAttribute('cart-total', `${total}`);
}

async function displayTheArticlesOnSale() {
  const contentArea = document.getElementById('content');

  for (let i = 0; i < articles.length; i++) {
    const
      article = {
        data: articles[i],
        element: document.createElement('my-article')
      },
      button = document.createElement('button');

    article.element.setAttribute('image', `../_assets/images/articles/${article.data.image}`);
    article.element.setAttribute('description', article.data.description);
    button.append(article.element);
    contentArea.append(button);

    button.addEventListener('click', async () => {
      // Execute a Qworum script
      // (See https://qworum.net/en/specification/v1/#script)
      await Qworum.eval(Script(
        Sequence(
          // Call the service end-point to view an article.
          // (See https://qworum.net/en/specification/v1/#call)
          Call(
            // The owner of this call is the same Qworum object as the owner of the current call.
            // (See https://qworum.net/en/specification/v1/#object)
            ['@'],

            // URL of the end-point to call.
            '../view-article/',

            // The data parameters of this call.
            [
              { name: 'article id', value: Json(i) }
            ]
          ),

          // Return to this page.
          Goto('index.html'),
        )
      ))
    });
  }
}

