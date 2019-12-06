[![GitHub release](https://img.shields.io/github/v/release/vanillawc/wc-codemirror.svg)](https://github.com/vanillawc/wc-codemirror/releases)
[![npm](https://badgen.net/npm/v/@vanillawc/wc-codemirror)](https://www.npmjs.com/package/@vanillawc/wc-codemirror)
[![downloads](https://badgen.net/npm/dt/@vanillawc/wc-codemirror)](https://www.npmjs.com/package/@vanillawc/wc-codemirror)
[![Known Vulnerabilities](https://snyk.io/test/npm/@vanillawc/wc-codemirror/badge.svg)](https://snyk.io/test/npm/@vanillawc/wc-codemirror)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/vanillawc/wc-codemirror/master/LICENSE)
[![Published on WebComponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@vanillawc/wc-codemirror)
[![Actions Status](https://github.com/vanillawc/wc-codemirror/workflows/Release/badge.svg)](https://github.com/vanillawc/wc-codemirror/actions)

A Vanilla Web Component to embed a CodeMirror editor into a web page

 <!-- TODO: Add video graphic here -->

-----

## Installation

```sh
npm i @vanillawc/wc-codemirror
```

Then import the `index.js` file at the root of the package.

-----

## Usage

```html
<wc-codemirror src="sample.js"></wc-codemirror>
```

**Attributes**

- `src` - load an external source file
- `style` - CSS styling (default `height:100%;width:100%;`)

*Note: The ID attribute is required if there are multiple editors*

**Properties**

- `value` - get/set the editor's contents

### Basic Usage

```html
<wc-codemirror src="./assets/sample.js"></wc-codemirror>
```

***Demo: [WC-CodeMirror - Basic Usage][]***

### Syntax Highlighting

```html
<wc-codemirror mode="javascript" src="./assets/sample.js"></wc-codemirror>
```

Modes require importing an additional plugin file that can be found in the 'modes' dir

```html
<script type="module" src="[wc-codemirror]/mode/javascript/javascript.js"></script>
```

***Demo: [WC-CodeMirror - 'mode' Attribute][]***

### Theming

```html
<wc-codemirror mode="javascript" theme="monokai" src="./assets/sample.js"></wc-codemirror>
```

Themes require importing an additional css file that contains the theme CSS definitions 

```html
<link rel="stylesheet" href="[wc-codemirror]/theme/monokai.css">
```

***Demo: [WC-CodeMirror - 'theme' Attribute][]***

## Demos

The demo can also be run locally with

```sh
npm run start
```

[WC-CodeMirror - Basic Usage]: https://vanillawc.github.io/wc-codemirror/demo/basic-usage.html
[WC-CodeMirror - 'mode' Attribute]: https://vanillawc.github.io/wc-codemirror/demo/mode-attribute.html
[WC-CodeMirror - 'theme' Attribute]: https://vanillawc.github.io/wc-codemirror/demo/theme-attribute.html
