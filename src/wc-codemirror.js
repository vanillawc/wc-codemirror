/* eslint no-undef: 0 */
import CodeMirror from '../node_modules/codemirror/src/codemirror.js'
import './styling.js'

self.CodeMirror = CodeMirror

/**
 * WCCodeMirror
 */
export class WCCodeMirror extends HTMLElement {
  static get observedAttributes () {
    return ['src', 'readonly', 'mode', 'theme']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (!this.__initialized) { return }
    if (oldValue !== newValue) {
      if (name === 'readonly') {
        this[name] = newValue !== null
      } else {
        this[name] = newValue
      }
    }
  }

  get readonly () { return this.editor.getOption('readOnly') }
  set readonly (value) {
    this.editor.setOption('readOnly', value)
  }

  get mode () { return this.editor.getOption('mode') }
  set mode (value) {
    this.editor.setOption('mode', value)
  }

  get theme () { return this.editor.getOption('theme') }
  set theme (value) {
    this.editor.setOption('theme', value)
  }

  get src () { return this.getAttribute('src') }
  set src (value) {
    this.setAttribute('src', value)
    this.setSrc()
  }

  get value () { return this.editor.getValue() }
  set value (value) {
    this.setValue(value)
  }

  constructor () {
    super()
    const template = document.createElement('template')
    template.innerHTML = WCCodeMirror.template()
    this.appendChild(template.content.cloneNode(true))
    this.__initialized = false
    this.__element = null
    this.editor = null
  }

  async connectedCallback () {
    this.style.display = 'block'
    this.__element = this.querySelector('textarea')

    const mode = this.hasAttribute('mode') ? this.getAttribute('mode') : 'null'
    const theme = this.hasAttribute('theme') ? this.getAttribute('theme') : 'default'
    let readOnly = this.getAttribute('readonly')

    if (readOnly === '') readOnly = true
    else if (readOnly !== 'nocursor') readOnly = false

    let content = ''
    const innerScriptTag = this.querySelector('script')
    if (innerScriptTag) {
      if (innerScriptTag.getAttribute('type') === 'wc-content') {
        content = WCCodeMirror.dedentText(innerScriptTag.innerHTML)
        content = content.replace(/&lt;(\/?script)(.*?)&gt;/g, '<$1$2>')
      }
    }

    let viewportMargin = CodeMirror.defaults.viewportMargin
    if (this.hasAttribute('viewport-margin')) {
      const viewportMarginAttr = this.getAttribute('viewport-margin').toLowerCase()
      viewportMargin = viewportMarginAttr === 'infinity' ? Infinity : parseInt(viewportMarginAttr)
    }

    this.editor = CodeMirror.fromTextArea(this.__element, {
      lineNumbers: true,
      readOnly,
      mode,
      theme,
      viewportMargin
    })

    if (this.hasAttribute('src')) {
      this.setSrc(this.getAttribute('src'))
    } else {
      // delay until editor initializes
      await new Promise(resolve => setTimeout(resolve, 50))
      this.value = content
    }

    this.__initialized = true
  }

  disconnectedCallback() {
    this.editor && this.editor.toTextArea()
    this.editor = null
    this.__initialized = false
  }

  async setSrc () {
    const src = this.getAttribute('src')
    const contents = await this.fetchSrc(src)
    this.value = contents
  }

  async setValue (value) {
    this.editor.swapDoc(CodeMirror.Doc(value, this.getAttribute('mode')))
    this.editor.refresh()
  }

  async fetchSrc (src) {
    const response = await fetch(src)
    return response.text()
  }

  static template () {
    return `
      <textarea style="display:inherit; width:inherit; height:inherit;"></textarea>
    `
  }

  /**
   * De-dents the code by getting the padding from the first line,
   * then removes the same indent amount padding from the rest of the lines
   *
   * @param {string} text - the text to dedent
   * @returns {string} the dedented text
   */
  static dedentText (text) {
    const lines = text.split('\n')

    // remove the first line if it is an empty line
    if (lines[0] === '') lines.splice(0, 1)

    const initline = lines[0]
    let fwdPad = 0
    const usingTabs = initline[0] === '\t'
    const checkChar = usingTabs ? '\t' : ' '

    while (true) {
      if (initline[fwdPad] === checkChar) {
        fwdPad += 1
      } else {
        break
      }
    }

    const fixedLines = []

    for (const line of lines) {
      let fixedLine = line
      for (let i = 0; i < fwdPad; i++) {
        if (fixedLine[0] === checkChar) {
          fixedLine = fixedLine.substring(1)
        } else {
          break
        }
      }
      fixedLines.push(fixedLine)
    }

    if (fixedLines[fixedLines.length - 1] === '') fixedLines.splice(fixedLines.length - 1, 1)

    return fixedLines.join('\n')
  }
}

customElements.define('wc-codemirror', WCCodeMirror)
