[![GitHub Releases](https://badgen.net/github/tag/vanillawc/wc-codemirror)](https://github.com/vanillawc/wc-codemirror/releases)
[![NPM Release](https://badgen.net/npm/v/@vanillawc/wc-codemirror)](https://www.npmjs.com/package/@vanillawc/wc-codemirror)
[![Bundlephobia](https://badgen.net/bundlephobia/minzip/@vanillawc/wc-codemirror)](https://bundlephobia.com/result?p=@vanillawc/wc-codemirror)
[![MIT License](https://badgen.net/github/license/vanillawc/wc-codemirror)](https://raw.githubusercontent.com/vanillawc/wc-codemirror/master/LICENSE)
[![Published on WebComponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@vanillawc/wc-codemirror)
[![Latest Status](https://github.com/vanillawc/wc-codemirror/workflows/Latest/badge.svg)](https://github.com/vanillawc/wc-codemirror/actions)
[![Release Status](https://github.com/vanillawc/wc-codemirror/workflows/Release/badge.svg)](https://github.com/vanillawc/wc-codemirror/actions)

A Vanilla Web Component to embed a CodeMirror editor into a web page

-----

## Installation

```sh
npm i @vanillawc/wc-codemirror
```

Then import the `index.js` file at the root of the package.

-----

## Usage

**Attributes**

- `src` - load an external source file
- `style` - CSS styling (default `height:100%;width:100%;`)

**Properties**

- `value` - get/set the editor's contents

*Note: The ID attribute is required when multiple editors instances are present*

### Basic Usage

```html
<wc-codemirror src="sample.js"></wc-codemirror>
```

### Syntax Highlighting

```html
<wc-codemirror mode="javascript" src="sample.js"></wc-codemirror>
```

Modes require importing an additional plugin file that can be found in the 'modes' dir

```html
<script type="module" src="[wc-codemirror]/mode/javascript/javascript.js"></script>
```

### Theming

```html
<wc-codemirror mode="javascript" theme="monokai" src="sample.js"></wc-codemirror>
```

Themes require importing an additional css file that contains the theme CSS definitions 

```html
<link rel="stylesheet" href="[wc-codemirror]/theme/monokai.css">
```

-----

## Demos

### [WC-CodeMirror - WebComponents.dev](https://webcomponents.dev/edit/uQEePfQ92jOWOpupDzps?sv=1&pm=1)
