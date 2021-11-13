/* eslint no-undef: 0 */
import CodeMirror from '../node_modules/codemirror/src/codemirror.js'
import { CODE_MIRROR_CSS_CONTENT } from './styling.js'

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
    if (this.__initialized) {
      this.setValueForced(value)
    } else {
      // Save to pre init
      this.__preInitValue = value
    }
  }

  constructor () {
    super()

    this.setupMutationObserver()
    this.attachShadow({ mode: 'open' })

    // Create template
    const template = document.createElement('template')
    const stylesheet = document.createElement('style')
    stylesheet.innerHTML = CODE_MIRROR_CSS_CONTENT
    template.innerHTML = WCCodeMirror.template()
    this.shadowRoot.appendChild(stylesheet)
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.__textMarks = []
    this.__gutters = []
    this.__initialized = false
    this.__element = null
    this.editor = null
  }

  async connectedCallback () {
    // Initialization
    this.style.display = 'block'
    this.__element = this.shadowRoot.querySelector('textarea')

    const mode = this.hasAttribute('mode') ? this.getAttribute('mode') : 'null'
    const theme = this.hasAttribute('theme') ? this.getAttribute('theme') : 'default'
    let readOnly = this.getAttribute('readonly')

    if (readOnly === '') readOnly = true
    else if (readOnly !== 'nocursor') readOnly = false

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

    this.refreshStyleLinks()
    this.refrestWcContent()

    if (this.hasAttribute('src')) {
      this.setSrc()
    }

    // delay until editor initializes
    await new Promise(resolve => setTimeout(resolve, 50))
    this.__initialized = true

    if (this.__preInitValue !== undefined) {
      this.setValueForced(this.__preInitValue)
    }

    // This should be invoked after text set
    this.refreshMarkText()
    this.refreshGutters()
  }

  disconnectedCallback () {
    this.editor && this.editor.toTextArea()
    this.editor = null
    this.__initialized = false
    this.__observer.disconnect()
  }

  async setSrc () {
    const src = this.getAttribute('src')
    const contents = await this.fetchSrc(src)
    this.value = contents
  }

  /**
   * Set value without initialization check
   */
  async setValueForced (value) {
    this.editor.swapDoc(CodeMirror.Doc(value, this.getAttribute('mode')))
    this.editor.refresh()
  }

  async fetchSrc (src) {
    const response = await fetch(src)
    return response.text()
  }

  refreshStyleLinks () {
    // Remove all <link> element in shadow root
    Array.from(this.shadowRoot.children).forEach(element => {
      if (element.tagName === 'LINK' && element.getAttribute('rel') === 'stylesheet') {
        element.remove()
      }
    })
    // Find all <link> elements in <wc-codemirror>
    Array.from(this.children).forEach(element => {
      if (element.tagName === 'LINK' && element.getAttribute('rel') === 'stylesheet') {
        this.shadowRoot.appendChild(element.cloneNode(true))
      }
    })
  }

  refrestWcContent () {
    const innerScriptTag = this.querySelector('script')
    if (innerScriptTag) {
      if (innerScriptTag.getAttribute('type') === 'wc-content') {
        const data = WCCodeMirror.dedentText(innerScriptTag.innerHTML)
        this.value = data.replace(/&lt;(\/?script)(.*?)&gt;/g, '<$1$2>')
      }
    }
  }

  refreshMarkText () {
    // Remove all old marks
    this.__textMarks.forEach(element => {
      element.clear()
    })
    this.__textMarks = Array.from(this.children)
      .filter(element => element.tagName === 'MARK-TEXT')
      .map(element => {
        try {
          const fromLine = parseInt(element.getAttribute('from-line'))
          const fromChar = parseInt(element.getAttribute('from-char'))
          const toLine = parseInt(element.getAttribute('to-line'))
          const toChar = parseInt(element.getAttribute('to-char'))
          const options = JSON.parse(element.getAttribute('options').replace(/'/g, '"'))
          const from = { line: fromLine, ch: fromChar }
          const to = { line: toLine, ch: toChar }
          return this.editor.markText(from, to, options)
        } catch (error) {
          console.error(error)
          // Return ermpty descriptor
          return { clear: () => {} }
        }
      })
  }

  refreshGutters () {
    // Remove all gutters
    this.__gutters.forEach(gutter => this.editor.clearGutter(gutter.name))
    this.__gutters = Array.from(this.children)
      .filter((g) => g.tagName === 'GUTTERS' && g.hasAttribute('name'))
      .map((g) => {
        return {
          name: g.getAttribute('name'),
          lines: Array.from(g.children)
            .filter(e => e.tagName === 'GUTTER' && e.children.length > 0)
            .map((e) => {
              const line = parseInt(e.getAttribute('line'))
              const firstChild = e.children[0]
              return { line, marker: firstChild.cloneNode(true) }
            })
        }
      })
    this.editor.setOption('gutters', this.__gutters.map((g) => g.name))
    // Setup markers
    this.__gutters.forEach((g) => {
      g.lines.forEach((e) => {
        this.editor.setGutterMarker(e.line, g.name, e.marker)
      })
    })
  }

  setupMutationObserver () {
    const observerConfig = {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true
    }

    const nodeListContainsTag = (nodeList, tag) => {
      const checkThatTag = (e) => e.tagName === tag
      const removed = Array.from(nodeList)
      return removed.some(checkThatTag)
    }

    const mutContainsRemovedTag = (tag) => (record) => {
      return nodeListContainsTag(record.removedNodes, tag)
    }

    const mutContainsAddedTag = (tag) => (record) => {
      return nodeListContainsTag(record.addedNodes, tag)
    }

    const mutTargetHierarchyContainsTag = (tag) => (record) => {
      let tagetMatched = false
      for (let t = record.target; t !== null && t !== this; t = t.parentNode) {
        if (t.tagName === tag) {
          tagetMatched = true
          break
        }
      }
      return tagetMatched
    }

    const mutContainsTag = (tag) => {
      const containsAdded = mutContainsAddedTag(tag)
      const containsRemoved = mutContainsRemovedTag(tag)
      const matchTarget = mutTargetHierarchyContainsTag(tag)

      return (record) => matchTarget(record) || containsAdded(record) || containsRemoved(record)
    }

    const mutContainsLink = mutContainsTag('LINK')
    const mutContainsMarkText = mutContainsTag('MARK-TEXT')
    const mutContainsGutters = mutContainsTag('GUTTERS')
    const mutContainsGutter = mutContainsTag('GUTTER')
    const mutContainsRemovedScript = mutContainsRemovedTag('SCRIPT')
    const mutContainsAddedScript = mutContainsAddedTag('SCRIPT')
    const mutTargetHierarchyContainsScript = mutTargetHierarchyContainsTag('SCRIPT')

    this.__observer = new MutationObserver((mutationsList, observer) => {
      let doRefreshMarks = false
      let doRefreshGutters = false

      mutationsList.forEach((record) => {
        if (mutContainsLink(record)) {
          this.refreshStyleLinks()
        }
        if (mutContainsRemovedScript(record)) {
          this.value = ''
          doRefreshMarks = true
          doRefreshGutters = true
        }
        if (mutContainsAddedScript(record) || mutTargetHierarchyContainsScript(record)) {
          this.refrestWcContent()
          doRefreshMarks = true
          doRefreshGutters = true
        }
        if (mutContainsGutters(record) || mutContainsGutter(record)) {
          doRefreshGutters = true
        }
        if (mutContainsMarkText(record)) {
          doRefreshMarks = true
        }
      })

      // Perform refresh
      if (doRefreshMarks) {
        this.refreshMarkText()
      }
      if (doRefreshGutters) {
        this.refreshGutters()
      }
    })

    this.__observer.observe(this, observerConfig)
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
