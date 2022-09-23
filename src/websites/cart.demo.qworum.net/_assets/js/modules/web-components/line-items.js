class MyLineItems extends HTMLElement {
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
          color: black; 
          --accent-color: #3241c2;
        }
        .shopping-cart {margin: 5em; width: 28em;}
        // .line-item::before {content: "🟢 ";}

        .line-item-unit-price {text-align: right; font-weight: bold; font-size: larger;}

        .amount::after {content: " ";}

        .total {
          text-align: right; 
          font-weight: bold; 
          font-size: larger;
          border-top: 0.2em solid lightgray;
          padding-top: 1em;
        }
        .total::before {content: "Total: ";}

        .line-item-count::before {content: " ( x ";}
        .line-item-count::after {content: " )";}
      </style>
      <div id='shopping-cart' class='shopping-cart'>
        <div id='line-items' class='line-items'>
          <!-- sample content -->
          <div class='line-item'>
            <p>
              <span class='line-item-title'>
                Nike SB - CHRON 2 PREMIUM UNISEX - Trainers
              </span>
              <span class='line-item-count'>
                1
              </span>
            </p>
            <p class='line-item-unit-price'>
              <span class='amount'>
                29.99 
              </span>
              <span class='currency'>
                €
              </span>
            </p>
          </div>
        </div>
        <div id='total' class='total'>
          <span id='total-amount' class='amount'>
            98.99 <!-- sample content -->
          </span>
          <span class='currency'>
            €
          </span>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(t.content.cloneNode(true));
    // this.shadowRoot.getElementById('button').onclick = this.handleClick.bind(this);
  }

  // handleClick(event) {
  //   if(!this.lineItems)return;
  //   window.location.href = `../external-services/payment-service/pay.qrm.xml`;
  // }

  // manage custom element attributes
  static get observedAttributes() {
    return ['line-items'];
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'line-items') {
      const
        lineItems = JSON.parse(newValue),
        lineItemsElement = this.shadowRoot.querySelector('#line-items'),
        totalAmountElement = this.shadowRoot.querySelector('#total-amount');

      lineItemsElement.innerHTML = '';
      totalAmountElement.innerHTML = '';

      let total = 0.0;

      for (const lineItemData of lineItems) {
        total += lineItemData.price.EUR;

        const
        lineItem      = document.createElement('div'),
        titleAndCount = document.createElement('p'),
        title         = document.createElement('span'),
        count         = document.createElement('span'),
        price         = document.createElement('p'),
        priceAmount   = document.createElement('span'),
        priceCurrency = document.createElement('span');

        lineItem.setAttribute('class', 'line-item');
        lineItem.append(titleAndCount, price);

        titleAndCount.append(title, count);

        price.setAttribute('class', 'line-item-unit-price');
        price.append(priceAmount, priceCurrency);

        title.setAttribute('class', 'line-item-title');
        title.innerText = lineItemData.title;

        count.setAttribute('class', 'line-item-count');
        count.innerText = lineItemData.count;

        priceAmount.setAttribute('class', 'amount');
        priceAmount.innerText = `${lineItemData.price.EUR}`;

        priceCurrency.setAttribute('class', 'currency');

        priceCurrency.innerText = '€';

        lineItemsElement.append(lineItem);
      }
      totalAmountElement.innerText = `${total}`;
      // console.log(`my-add-to-cart-button: set article to ${newValue}`);
    }
  }
}

export { MyLineItems };
