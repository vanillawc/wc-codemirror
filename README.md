[![GitHub release](https://img.shields.io/github/v/release/vanillawc/wc-codemirror.svg)](https://github.com/vanillawc/wc-codemirror/releases)
[![npm](https://badgen.net/npm/v/@vanillawc/wc-codemirror)](https://www.npmjs.com/package/@vanillawc/wc-codemirror)
[![downloads](https://badgen.net/npm/dt/@vanillawc/wc-codemirror)](https://www.npmjs.com/package/@vanillawc/wc-codemirror)
[![Known Vulnerabilities](https://snyk.io/test/npm/@vanillawc/wc-codemirror/badge.svg)](https://snyk.io/test/npm/@vanillawc/wc-codemirror)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/vanillawc/wc-codemirror/master/LICENSE)
[![Actions Status](https://github.com/vanillawc/wc-codemirror/workflows/Release/badge.svg)](https://github.com/vanillawc/wc-codemirror/actions)

A Vanilla Web Component to embed a Monaco code editor into a web page

 <!-- TODO: Add video graphic here -->

-----

## Installation

```sh
npm i @vanillawc/wc-codemirror
```

This will create the `wc-codemirror` folder in `node_modules`.

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

### Load the source from an external source

```html
<wc-codemirror src="./assets/sample.js"></wc-codemirror>
```

***Demo: [WC-CodeMirror - Demo][]***

## Demos

The demo can also be run locally with

```sh
npm run start
```

[WC-CodeMirror - Demo]: https://vanillawc.github.io/wc-codemirror/demo/index.html
