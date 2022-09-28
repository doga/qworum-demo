// from an online blog post

// TODO remove header links that break the execution

class MySiteBanner extends HTMLElement {
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
        }
        /* Style the header with a grey background and some padding */
        .header {
          overflow: hidden;
          background-color: #f1f1f1;
          padding: 20px 10px;
        }
        
        /* Style the header links */
        .header a {
          float: left;
          color: black;
          text-align: center;
          padding: 12px;
          text-decoration: none;
          font-size: 18px;
          line-height: 25px;
          border-radius: 4px;
        }
        
        /* Style the logo link (notice that we set the same value of line-height and font-size to prevent the header to increase when the font gets bigger */
        .header a.logo {
          font-size: 25px;
          font-weight: bold;
          font-family: cursive; 
        }
        
        /* Change the background color on mouse-over */
        .header a:hover {
          background-color: #ddd;
          color: black;
        }
        
        /* Style the active/current link*/
        .header a.active {
          background-color: #C9A233;
          // background-color: dodgerblue;
          color: white;
        }
        
        /* Float the link section to the right */
        .header-right {
          float: right;
        }

        button {
          cursor: pointer;
          font-size: 1.2em;
          padding: 1em;
          border: 0px;
        }
        
        /* Add media queries for responsiveness - when the screen is 500px wide or less, stack the links on top of each other */
        @media screen and (max-width: 500px) {
          .header a {
            float: none;
            display: block;
            text-align: left;
          }
          .header-right {
            float: none;
          }
        }
      </style>
      <div class="header">
        <a class="logo" id='logo'>
          Company Logo
        </a>
        <div class="header-right">
          <button onclick="window.location.replace('view-shopping-cart.qrm.xml')">
            🛒 Shopping cart (<span id='cart-total'>0</span> €)
          </button>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(t.content.cloneNode(true));
  }

  // manage custom element attributes
  static get observedAttributes() {
    return ['logo', 'cart-total'];
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'logo') {
      this.shadowRoot.getElementById(attrName).innerText = newValue;
    } else if (attrName === 'cart-total') {
      this.shadowRoot.getElementById(attrName).innerText = `${newValue}`;
    }
  }

}

export {MySiteBanner};

// window.customElements.define('my-site-banner', MySiteBanner);
