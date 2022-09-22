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
import { shopUrl, cartUrl, paymentsUrl } from "./modules/website-urls.mjs";
import { articles } from "./modules/articles.mjs";
console.log(`shopUrl: ${shopUrl}`);
console.log(`articles: ${JSON.stringify(articles)}`);

// Web components
import { MyAddToCartButton } from "./modules/web-components/add-to-cart-button.mjs";
import { MyArticle } from "./modules/web-components/article.mjs";
import { MySiteBanner } from "./modules/web-components/site-banner.mjs";
window.customElements.define('my-add-to-cart-button', MyAddToCartButton);
window.customElements.define('my-article', MyArticle);
window.customElements.define('my-site-banner', MySiteBanner);

// UI
displayTheArticlesOnSale();

function displayTheArticlesOnSale() {
  const contentArea = document.getElementById('content');

  for (let i = 0; i < articles.length; i++) {
    const
    article = {
      data   : articles[i],
      element: document.createElement('my-article')
    },
    button  = document.createElement('button');

    article.element.setAttribute('image', `../_assets/images/articles/${article.data.image}`);
    article.element.setAttribute('description', article.data.description);
    button.append(article.element);
    contentArea.append(button);

    button.addEventListener('click', () => {
      // Execute a Qworum script
      Qworum.eval(Script(
        Sequence([
          // Call the Qworum end-point to view an article ...
          Call('@', `../view-article/?articleId=${i}`),
          
          // ... then return to this page.
          Goto('index.html'),
        ])
      ))
    });
  }
}

