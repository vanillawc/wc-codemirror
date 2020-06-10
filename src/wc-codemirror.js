/* eslint no-undef: 0 */
import CodeMirror from '../node_modules/codemirror/src/codemirror.js';
self.CodeMirror = CodeMirror;

/**
 * the WC codemirror class
 */
export class WCCodeMirror extends HTMLElement {
  static get observedAttributes () {
    return ['src'];
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (!this.__initialized) { return; }
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  get src () { return this.getAttribute('src'); }
  set src (value) {
    this.setAttribute('src', value);
    this.setSrc();
  }

  get value () { return this.__editor.getValue(); }
  set value (value) {
    this.setValue(value);
  }

  constructor () {
    super();
    const template = document.createElement('template');
    template.innerHTML = WCCodeMirror.template();
    this.appendChild(template.content.cloneNode(true));
    this.__initialized = false;
    this.__element = null;
    this.__editor = null;
  }

  async connectedCallback () {
    this.__element = this.querySelector('textarea');
    this.__element.style = this.hasAttribute('style') ? this.style.cssText : 'width:100%;height:100%';

    const mode = this.hasAttribute('mode') ? this.getAttribute('mode') : 'null';
    const theme = this.hasAttribute('theme') ? this.getAttribute('theme') : 'default';
    let content = '';
    const innerScriptTag = this.querySelector('script');
    if (innerScriptTag) {
      if (innerScriptTag.getAttribute('type') === 'wc-content') {
        content = WCCodeMirror.dedentText(innerScriptTag.innerHTML);
      }
    }

    this.__editor = CodeMirror.fromTextArea(this.__element, {
      lineNumbers: true,
      readOnly: false,
      mode,
      theme
    });

    if (this.hasAttribute('src')) {
      this.setSrc(this.getAttribute('src'));
    } else {
      // delay until editor initializes
      await new Promise(resolve => setTimeout(resolve, 50));
      this.setValue(content);
    }

    this.__initialized = true;
  }

  async setSrc () {
    const src = this.getAttribute('src');
    const contents = await this.fetchSrc(src);
    this.__editor.swapDoc(CodeMirror.Doc(contents, this.getAttribute('mode')));
    this.__editor.refresh();
  }

  async setValue (value) {
    this.__editor.swapDoc(CodeMirror.Doc(value, this.getAttribute('mode')));
    this.__editor.refresh();
  }

  async fetchSrc (src) {
    const response = await fetch(src);
    return response.text();
  }

  static template () {
    return `
      <textarea></textarea>
      `;
  }

  /**
   * gets the padding from the first line, then removes the
   * same amount padding from the rest of the lines, if possible
   *
   * useful for removing unnecessary padding in, say <script> tags
   *
   * @param {string} text - the text to dedent
   * @returns {string} string without unnecessary line wist padding
   */
  static dedentText (text) {
    const lines = text.split('\n');

    // remove the first line if it is an empty line
    if (lines[0] === '') lines.splice(0, 1);

    const initline = lines[0];
    let fwdPad = 0;

    while (true) {
      if (initline[fwdPad] === ' ') {
        fwdPad += 1;
      } else {
        break;
      }
    }

    const fixedLines = [];

    for (const line of lines) {
      let fixedLine = line;
      for (let i = 0; i < fwdPad; i++) {
        if (fixedLine[0] === ' ') {
          fixedLine = fixedLine.substring(1);
        } else {
          break;
        }
      }
      fixedLines.push(fixedLine);
    }

    if (fixedLines[fixedLines.length - 1] === '') fixedLines.splice(fixedLines.length - 1, 1);

    return fixedLines.join('\n');
  }
}

document.body.insertAdjacentHTML('beforeend', `
      <style>
      /* BASICS */

      .CodeMirror {
        /* Set height, width, borders, and global font properties here */
        font-family: monospace;
        height: 300px;
        color: black;
        direction: ltr;
      }

      /* PADDING */

      .CodeMirror-lines {
        padding: 4px 0; /* Vertical padding around content */
      }
      .CodeMirror pre.CodeMirror-line,
      .CodeMirror pre.CodeMirror-line-like {
        padding: 0 4px; /* Horizontal padding of content */
      }

      .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
        background-color: white; /* The little square between H and V scrollbars */
      }

      /* GUTTER */

      .CodeMirror-gutters {
        border-right: 1px solid #ddd;
        background-color: #f7f7f7;
        white-space: nowrap;
      }
      .CodeMirror-linenumbers {}
      .CodeMirror-linenumber {
        padding: 0 3px 0 5px;
        min-width: 20px;
        text-align: right;
        color: #999;
        white-space: nowrap;
      }

      .CodeMirror-guttermarker { color: black; }
      .CodeMirror-guttermarker-subtle { color: #999; }

      /* CURSOR */

      .CodeMirror-cursor {
        border-left: 1px solid black;
        border-right: none;
        width: 0;
      }
      /* Shown when moving in bi-directional text */
      .CodeMirror div.CodeMirror-secondarycursor {
        border-left: 1px solid silver;
      }
      .cm-fat-cursor .CodeMirror-cursor {
        width: auto;
        border: 0 !important;
        background: #7e7;
      }
      .cm-fat-cursor div.CodeMirror-cursors {
        z-index: 1;
      }
      .cm-fat-cursor-mark {
        background-color: rgba(20, 255, 20, 0.5);
        -webkit-animation: blink 1.06s steps(1) infinite;
        -moz-animation: blink 1.06s steps(1) infinite;
        animation: blink 1.06s steps(1) infinite;
      }
      .cm-animate-fat-cursor {
        width: auto;
        border: 0;
        -webkit-animation: blink 1.06s steps(1) infinite;
        -moz-animation: blink 1.06s steps(1) infinite;
        animation: blink 1.06s steps(1) infinite;
        background-color: #7e7;
      }
      @-moz-keyframes blink {
        0% {}
        50% { background-color: transparent; }
        100% {}
      }
      @-webkit-keyframes blink {
        0% {}
        50% { background-color: transparent; }
        100% {}
      }
      @keyframes blink {
        0% {}
        50% { background-color: transparent; }
        100% {}
      }

      /* Can style cursor different in overwrite (non-insert) mode */
      .CodeMirror-overwrite .CodeMirror-cursor {}

      .cm-tab { display: inline-block; text-decoration: inherit; }

      .CodeMirror-rulers {
        position: absolute;
        left: 0; right: 0; top: -50px; bottom: 0;
        overflow: hidden;
      }
      .CodeMirror-ruler {
        border-left: 1px solid #ccc;
        top: 0; bottom: 0;
        position: absolute;
      }

      /* DEFAULT THEME */

      .cm-s-default .cm-header {color: blue;}
      .cm-s-default .cm-quote {color: #090;}
      .cm-negative {color: #d44;}
      .cm-positive {color: #292;}
      .cm-header, .cm-strong {font-weight: bold;}
      .cm-em {font-style: italic;}
      .cm-link {text-decoration: underline;}
      .cm-strikethrough {text-decoration: line-through;}

      .cm-s-default .cm-keyword {color: #708;}
      .cm-s-default .cm-atom {color: #219;}
      .cm-s-default .cm-number {color: #164;}
      .cm-s-default .cm-def {color: #00f;}
      .cm-s-default .cm-variable,
      .cm-s-default .cm-punctuation,
      .cm-s-default .cm-property,
      .cm-s-default .cm-operator {}
      .cm-s-default .cm-variable-2 {color: #05a;}
      .cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}
      .cm-s-default .cm-comment {color: #a50;}
      .cm-s-default .cm-string {color: #a11;}
      .cm-s-default .cm-string-2 {color: #f50;}
      .cm-s-default .cm-meta {color: #555;}
      .cm-s-default .cm-qualifier {color: #555;}
      .cm-s-default .cm-builtin {color: #30a;}
      .cm-s-default .cm-bracket {color: #997;}
      .cm-s-default .cm-tag {color: #170;}
      .cm-s-default .cm-attribute {color: #00c;}
      .cm-s-default .cm-hr {color: #999;}
      .cm-s-default .cm-link {color: #00c;}

      .cm-s-default .cm-error {color: #f00;}
      .cm-invalidchar {color: #f00;}

      .CodeMirror-composing { border-bottom: 2px solid; }

      /* Default styles for common addons */

      div.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}
      div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}
      .CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }
      .CodeMirror-activeline-background {background: #e8f2ff;}

      /* STOP */

      /* The rest of this file contains styles related to the mechanics of
        the editor. You probably shouldn't touch them. */

      .CodeMirror {
        position: relative;
        overflow: hidden;
        background: white;
      }

      .CodeMirror-scroll {
        overflow: scroll !important; /* Things will break if this is overridden */
        /* 30px is the magic margin used to hide the element's real scrollbars */
        /* See overflow: hidden in .CodeMirror */
        margin-bottom: -30px; margin-right: -30px;
        padding-bottom: 30px;
        height: 100%;
        outline: none; /* Prevent dragging from highlighting the element */
        position: relative;
      }
      .CodeMirror-sizer {
        position: relative;
        border-right: 30px solid transparent;
      }

      /* The fake, visible scrollbars. Used to force redraw during scrolling
        before actual scrolling happens, thus preventing shaking and
        flickering artifacts. */
      .CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
        position: absolute;
        z-index: 6;
        display: none;
      }
      .CodeMirror-vscrollbar {
        right: 0; top: 0;
        overflow-x: hidden;
        overflow-y: scroll;
      }
      .CodeMirror-hscrollbar {
        bottom: 0; left: 0;
        overflow-y: hidden;
        overflow-x: scroll;
      }
      .CodeMirror-scrollbar-filler {
        right: 0; bottom: 0;
      }
      .CodeMirror-gutter-filler {
        left: 0; bottom: 0;
      }

      .CodeMirror-gutters {
        position: absolute; left: 0; top: 0;
        min-height: 100%;
        z-index: 3;
      }
      .CodeMirror-gutter {
        white-space: normal;
        height: 100%;
        display: inline-block;
        vertical-align: top;
        margin-bottom: -30px;
      }
      .CodeMirror-gutter-wrapper {
        position: absolute;
        z-index: 4;
        background: none !important;
        border: none !important;
      }
      .CodeMirror-gutter-background {
        position: absolute;
        top: 0; bottom: 0;
        z-index: 4;
      }
      .CodeMirror-gutter-elt {
        position: absolute;
        cursor: default;
        z-index: 4;
      }
      .CodeMirror-gutter-wrapper ::selection { background-color: transparent }
      .CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }

      .CodeMirror-lines {
        cursor: text;
        min-height: 1px; /* prevents collapsing before first draw */
      }
      .CodeMirror pre.CodeMirror-line,
      .CodeMirror pre.CodeMirror-line-like {
        /* Reset some styles that the rest of the page might have set */
        -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;
        border-width: 0;
        background: transparent;
        font-family: inherit;
        font-size: inherit;
        margin: 0;
        white-space: pre;
        word-wrap: normal;
        line-height: inherit;
        color: inherit;
        z-index: 2;
        position: relative;
        overflow: visible;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-variant-ligatures: contextual;
        font-variant-ligatures: contextual;
      }
      .CodeMirror-wrap pre.CodeMirror-line,
      .CodeMirror-wrap pre.CodeMirror-line-like {
        word-wrap: break-word;
        white-space: pre-wrap;
        word-break: normal;
      }

      .CodeMirror-linebackground {
        position: absolute;
        left: 0; right: 0; top: 0; bottom: 0;
        z-index: 0;
      }

      .CodeMirror-linewidget {
        position: relative;
        z-index: 2;
        padding: 0.1px; /* Force widget margins to stay inside of the container */
      }

      .CodeMirror-widget {}

      .CodeMirror-rtl pre { direction: rtl; }

      .CodeMirror-code {
        outline: none;
      }

      /* Force content-box sizing for the elements where we expect it */
      .CodeMirror-scroll,
      .CodeMirror-sizer,
      .CodeMirror-gutter,
      .CodeMirror-gutters,
      .CodeMirror-linenumber {
        -moz-box-sizing: content-box;
        box-sizing: content-box;
      }

      .CodeMirror-measure {
        position: absolute;
        width: 100%;
        height: 0;
        overflow: hidden;
        visibility: hidden;
      }

      .CodeMirror-cursor {
        position: absolute;
        pointer-events: none;
      }
      .CodeMirror-measure pre { position: static; }

      div.CodeMirror-cursors {
        visibility: hidden;
        position: relative;
        z-index: 3;
      }
      div.CodeMirror-dragcursors {
        visibility: visible;
      }

      .CodeMirror-focused div.CodeMirror-cursors {
        visibility: visible;
      }

      .CodeMirror-selected { background: #d9d9d9; }
      .CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }
      .CodeMirror-crosshair { cursor: crosshair; }
      .CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }
      .CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }

      .cm-searching {
        background-color: #ffa;
        background-color: rgba(255, 255, 0, .4);
      }

      /* Used to force a border model for a node */
      .cm-force-border { padding-right: .1px; }

      @media print {
        /* Hide the cursor when printing */
        .CodeMirror div.CodeMirror-cursors {
          visibility: hidden;
        }
      }

      /* See issue #2901 */
      .cm-tab-wrap-hack:after { content: ''; }

      /* Help users use markselection to safely style text background */
      span.CodeMirror-selectedtext { background: none; }
      </style>
`);

customElements.define('wc-codemirror', WCCodeMirror);
