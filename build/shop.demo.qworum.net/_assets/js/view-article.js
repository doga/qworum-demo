// Qworum library
import { Qworum } from "./modules/qworum/qworum-for-web-pages.mjs";
console.log(`Qworum.version: ${Qworum.version}`);
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

// Application data
import { articles } from "./modules/articles.mjs";
console.log(`articles: ${JSON.stringify(articles)}`);

// Web components
import { MyArticle } from "./modules/web-components/article.mjs";
import { MySiteBanner } from "./modules/web-components/site-banner.mjs";
window.customElements.define('my-article', MyArticle);
window.customElements.define('my-site-banner', MySiteBanner);

// UI

Qworum.getData('article id', (articleId) => {
  if (!(articleId && articleId instanceof Qworum.message.Json && articles[articleId.value])) {
    Qworum.eval(Script(
      Fault('* the "article id" call parameter is missing or invalid')
    ));
    return;
  }
  displayTheArticleOnSale(articleId.value);
  displayCartTotal();
});

function displayCartTotal() {
  Qworum.getData(['@', 'shopping cart', 'total'], (total) => {
    if (total instanceof Qworum.message.Json) {
      total = total.value.EUR;
    } else {
      total = 0.0;
    }

    document.querySelector('#banner').setAttribute('cart-total', `${total}`);
  });
}

function displayTheArticleOnSale(articleId) {
  // alert(`article id: ${articleId}`);
  const
  contentArea     = document.getElementById('content'),
  addToCartButton = document.getElementById('add-to-cart-button'),
  homepageButton  = document.getElementById('homepage-button'),
  article         = {
    id     : articleId,
    data   : articles[articleId],
    element: document.createElement('my-article')
  };

  article.element.setAttribute('image', `../_assets/images/articles/${article.data.image}`);
  article.element.setAttribute('description', article.data.description);
  contentArea.append(article.element);

  addToCartButton.addEventListener('click', () => {
    // Execute a Qworum script
    Qworum.eval(Script(
      Sequence(
        Call(
          ['@', 'shopping cart'], '/build/cart.demo.qworum.net/add-items/', 
          [{
            name: 'line items to add', 
            value: Json([{
              // article: {
              // }, 
              id   : article.id,
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

  homepageButton.addEventListener('click', () => {
    // Execute a Qworum script
    Qworum.eval(Script(
      Return(Json(0))
    ));
  });
}
