// Use Qworum
import { Qworum } from "./modules/qworum/qworum-for-web-pages.mjs";
console.log(`Qworum.version: ${Qworum.version}`);

// Web components
import { MyAddToCartButton } from "./modules/web-components/add-to-cart-button.mjs";
import { MyArticle } from "./modules/web-components/article.mjs";
import { MySiteBanner } from "./modules/web-components/site-banner.mjs";
window.customElements.define('my-add-to-cart-button', MyAddToCartButton);
window.customElements.define('my-article', MyArticle);
window.customElements.define('my-site-banner', MySiteBanner);

// Application data
import { shopUrl, cartUrl, paymentsUrl } from "./modules/website-urls.mjs";
import { articles } from "./modules/articles.mjs";
console.log(`shopUrl: ${shopUrl}`);
console.log(`articles: ${JSON.stringify(articles)}`);
