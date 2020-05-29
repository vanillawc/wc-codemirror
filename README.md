<h1 align="center">&lt;wc-codemirror&gt;: Easily embed a CodeMirror editor</h1>

<div align="center">
  <a href="https://github.com/vanillawc/wc-codemirror/releases"><img src="https://badgen.net/github/tag/vanillawc/wc-codemirror" alt="GitHub Releases"></a>
  <a href="https://www.npmjs.com/package/@vanillawc/wc-codemirror"><img src="https://badgen.net/npm/v/@vanillawc/wc-codemirror" alt="NPM Releases"></a>
  <a href="https://bundlephobia.com/result?p=@vanillawc/wc-codemirror"><img src="https://badgen.net/bundlephobia/minzip/@vanillawc/wc-codemirror" alt="Bundlephobia"></a>
  <a href="https://raw.githubusercontent.com/vanillawc/wc-codemirror/master/LICENSE"><img src="https://badgen.net/github/license/vanillawc/wc-codemirror" alt="MIT License"></a>
  <a href="https://www.webcomponents.org/element/@vanillawc/wc-codemirror"><img src="https://img.shields.io/badge/webcomponents.org-published-blue.svg" alt="Published on WebComponents.org"></a>
  <a href="https://github.com/vanillawc/wc-codemirror/actions"><img src="https://github.com/vanillawc/wc-codemirror/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillawc/wc-codemirror/actions"><img src="https://github.com/vanillawc/wc-codemirror/workflows/Release/badge.svg" alt="Release Status"></a>
</div>

## Installation

*Installation*
```sh
npm i @vanillawc/wc-codemirror
```

*Import from NPM*
```html
<script type="module" src="node_modules/@vanillawc/wc-codemirror/index.js"></script>
```

*Import from CDN*
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/vanillawc/wc-codemirror/index.js"></script>
```

## Demo

Try it on [WebComponents.dev](https://webcomponents.dev/edit/uQEePfQ92jOWOpupDzps?sv=1&pm=1)

## Usage

**Attributes**

- `src` - load an external source file
- `style` - CSS styling (default `height:100%;width:100%;`)

**Properties**

- `value` - get/set the editor's contents

*Note: The ID attribute is required when multiple editors instances are present*

### Basic Usage

An empty tag loads a basic CodeMirror editor pane

```html
<wc-codemirror></wc-codemirror>
```

## External Source

Load an external source file with the `src` attribute

```html
<wc-codemirror src="sample.txt"></wc-codemirror>
```

### Syntax Highlighting

Syntax highlighting requires importing a `mode` module for the language

```html
<script type="module" src="[wc-codemirror]/mode/javascript/javascript.js"></script>
```

Then specify the language with the `mode` attribute

```html
<wc-codemirror mode="javascript"></wc-codemirror>
```

### Theming

Theming requires importing an editor theme stylesheet

```html
<link rel="stylesheet" href="[wc-codemirror]/theme/monokai.css">
```

Then specify the theme with the `theme` attribute

```html
<wc-codemirror mode="javascript" theme="monokai"></wc-codemirror>
```
