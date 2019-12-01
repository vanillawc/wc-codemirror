/* eslint no-undef: 0 */
import CodeMirror from '../vendor/codemirror/codemirror.js';
self.CodeMirror = CodeMirror;
const template = document.createElement('template');
template.innerHTML = `
<style>

</style>

<div id="header">
  <h1 id="title"></h1>
  <h1><a id="link">GitHub</a></h1>
</div>
<div id="container">
  <section id="content">
    <h2>Description</h2>
    <p id="description"></p>
    <hr>
    <h2>Usage</h2>
    <source-element id="source"></source-element>
    <hr />
    <h2>Output</h2>
    <div id="output"></div>
  </section>
</div>
`;


export class WCCodeMirror extends HTMLElement {
  constructor () {
    super();
    this.__element = null;
    this.__editor = null;
  }

  static get observedAttributes () {
    return ['src', 'value'];
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  get src () { return this.getAttribute('src'); }
  set src (value) {
    this.setAttribute('src', value);
    this.fetchSrc();
  }

  get value () { return this.__editor.getValue(); }
  set value (value) {
    this.__editor.setValue(value);
  }

  async connectedCallback () {
    this.initialize();

    if (this.hasAttribute('src')) {
      this.fetchSrc();
    }
  }

  initialize () {
    // set a unique id (defaults to 'editor')
    this.__element = document.createElement('div');
    this.__element.id = this.hasAttribute('id') ? `${this.getAttribute('id')}-editor` : 'editor';
    // set styling (defaults to fit outer container)
    this.__element.style = this.hasAttribute('style') ? this.style.cssText : 'width:100%;height:100%';
    this.appendChild(this.__element);

    // create the editor
    this.__editor = CodeMirror(this.__element, {
      mode: this.getAttribute('mode'),
      theme: "solarized"
    });

  }

  async fetchSrc () {
    // fetch the external markdown source
    const response = await fetch(this.src);
    const contents = await response.text();
    this.__editor.setValue(contents);
  }
}

customElements.define('wc-codemirror', WCCodeMirror);
