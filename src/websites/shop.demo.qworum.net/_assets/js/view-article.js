// Qworum library
// import { Qworum } from "./modules/qworum/qworum-for-web-pages.mjs";
import { Qworum } from "https://cdn.skypack.dev/@qworum/qworum-for-web-pages@1.0.9";
// import { Qworum } from "https://cdn.skypack.dev/pin/@qworum/qworum-for-web-pages@v1.0.9-nzYMp2BgqXdEyoY7FP9r/mode=imports,min/optimized/@qworum/qworum-for-web-pages.js";
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
  let articleId = await Qworum.getData('article id');
  if (!(articleId && articleId instanceof Qworum.message.Json && articles[articleId.value])) {
    await Qworum.eval(Script(
      Fault('* the "article id" call parameter is missing or invalid')
    ));
    return;
  }
  await displayTheArticleOnSale(articleId.value);
  await displayCartTotal();
}

async function displayCartTotal() {
  let total = await Qworum.getData(['@', 'shopping cart', 'total']);
  if (total instanceof Qworum.message.Json) {
    total = total.value.EUR;
  } else {
    total = 0.0;
  }

  document.querySelector('#banner').setAttribute('cart-total', `${total}`);
}

async function displayTheArticleOnSale(articleId) {
  // alert(`article id: ${articleId}`);
  const
    contentArea = document.getElementById('content'),
    addToCartButton = document.getElementById('add-to-cart-button'),
    homepageButton = document.getElementById('homepage-button'),
    article = {
      id: articleId,
      data: articles[articleId],
      element: document.createElement('my-article')
    };

  article.element.setAttribute('image', `../_assets/images/articles/${article.data.image}`);
  article.element.setAttribute('description', article.data.description);
  contentArea.append(article.element);

  addToCartButton.addEventListener('click', async () => {
    // Execute a Qworum script
    await Qworum.eval(Script(
      Sequence(
        Call(
          ['@', 'shopping cart'], '@@cart/add-items/',
          [{
            name: 'line items to add',
            value: Json([{
              id: article.id,
              title: article.data.title,
              price: article.data.price,
              count: 1,
            }])
          }]
        ),
        // Goto('index.html')
      )
    ));
  });

  homepageButton.addEventListener('click', async () => {
    // Execute a Qworum script
    await Qworum.eval(Script(
      Return(Json(0))
    ));
  });
}
