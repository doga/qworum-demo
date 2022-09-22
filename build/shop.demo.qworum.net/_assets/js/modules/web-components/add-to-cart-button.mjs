// from an online blog post
class MyAddToCartButton extends HTMLElement {// TODO delete this file
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }
  render() {
    const t = document.createElement('template');
    t.innerHTML = `
      <style>
        :host {
          color: white; 
          --accent-color: #C9A233;
        }
        button {
          color: white; 
          background-color: var(--accent-color);
          font-size: larger;
          margin-left: 5em;
          padding: 0.5em 2em;
        }
      </style>
      <button id='button'>
        Add to shopping cart
      </button>
    `;
    this.shadowRoot.appendChild(t.content.cloneNode(true));
    this.shadowRoot.getElementById('button').onclick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (!this.article) return;
    window.location.href = `add-to-cart.qrm.xml?articleId=${this.article}`;
  }

  // manage custom element attributes
  static get observedAttributes() {
    return ['article'];
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'article') {
      this.article = newValue;
      this.shadowRoot.getElementById('button').dataset.article = newValue;
      // console.log(`my-add-to-cart-button: set article to ${newValue}`);
    }
  }

}

export {MyAddToCartButton};

// window.customElements.define('my-add-to-cart-button', MyAddToCartButton);
