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

// Web components
// import { MySiteBanner } from "./modules/web-components/site-banner.mjs";
// window.customElements.define('my-site-banner', MySiteBanner);

// UI

console.log(`reading line items to add`);
Qworum.getData('line items to add', (lineItemsToAdd) => {
  // Validate the call parameter
  if (!(lineItemsToAdd && lineItemsToAdd instanceof Qworum.message.Json && lineItemsToAdd.value instanceof Array)) { // TODO deep data validation
    Qworum.eval(Script(
      Fault('* the "line items to add" call parameter is missing or invalid')
    ));
    return;
  }

  console.log(`reading line items`);

  // Update the cart
  Qworum.getData(['@', 'line items'], (lineItems) => {
    if(!(lineItems instanceof Qworum.message.Json)){
      lineItems = [];
    } else {
      lineItems = lineItems.value;
    }
    lineItems = lineItems.concat(lineItemsToAdd);
    lineItems = Json(lineItems);

    console.log(`updating line items`);
    Qworum.setData(['@', 'line items'], lineItems, (success) => {
      if(!success){
        Qworum.eval(Script(
          Fault('* the shopping cart was not updated')
        ));
        return;
      }
      // show the cart
      Qworum.eval(Script(
        Call('@', '../show-cart/')
      ));
      // window.location.replace('../show-cart/');
    });
  });

});


function displayTheArticleOnSale(articleId) {
  // alert(`article id: ${articleId}`);
  const
  contentArea     = document.getElementById('content'),
  addToCartButton = document.getElementById('add-to-cart-button'),
  homepageButton  = document.getElementById('homepage-button'),
  article         = {
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
          [
            {name: 'line items to add', value: Json([{article: article.data, count: 1}])}
          ]
        ),
        Goto('index.html')
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
