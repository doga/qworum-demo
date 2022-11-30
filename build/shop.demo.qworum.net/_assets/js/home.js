// Qworum library
import { Qworum } from "./modules/qworum/qworum-for-web-pages.mjs";
//console.log(`Qworum.version: ${Qworum.version}`);
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
  let total = await Qworum.runtime.getData(['@', 'shopping cart', 'total']);

  if (total instanceof Qworum.runtime.message.Json) {
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
      await Qworum.runtime.eval(Script(
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

