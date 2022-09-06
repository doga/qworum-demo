// from an online blog post
class MyComp extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  render(){
    const t = document.createElement('template');
    t.innerHTML = `
      <style>
        :host {
          color: white; 
        }
        article {
          padding: 2em;
        }
        article h1 {
          font-style: italic;
          text-decoration: underline;
        }
      </style>
      <article>
        <h1><span id='name'></span></h1>
        <slot name='description'></slot>
      </article>
    `;
    this.shadowRoot.appendChild(t.content.cloneNode(true));
  }

  // manage custom element attributes
  static get observedAttributes(){
    return ['name'];
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    this.shadowRoot.getElementById(attrName).innerText = newValue;
  }
  
}

export {MyComp};

// window.customElements.define('my-comp', MyComp);
