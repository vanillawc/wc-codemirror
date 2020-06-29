<h1 align="center">&lt;wc-codemirror&gt; Easily embed a CodeMirror editor</h1>

<div align="center">
  <a href="https://github.com/vanillawc/wc-codemirror/releases"><img src="https://badgen.net/github/tag/vanillawc/wc-codemirror" alt="GitHub Releases"></a>
  <a href="https://www.npmjs.com/package/@vanillawc/wc-codemirror"><img src="https://badgen.net/npm/v/@vanillawc/wc-codemirror" alt="NPM Releases"></a>
  <a href="https://bundlephobia.com/result?p=@vanillawc/wc-codemirror"><img src="https://badgen.net/bundlephobia/minzip/@vanillawc/wc-codemirror" alt="Bundlephobia"></a>
  <a href="https://github.com/vanillawc/wc-codemirror/actions"><img src="https://github.com/vanillawc/wc-codemirror/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillawc/wc-codemirror/actions"><img src="https://github.com/vanillawc/wc-codemirror/workflows/Release/badge.svg" alt="Release Status"></a>

  <a href="https://discord.gg/8ur9M5"><img alt="Discord" src="https://img.shields.io/discord/723296249121603604?color=%23738ADB"></a>
  <a href="https://www.webcomponents.org/element/@vanillawc/wc-codemirror"><img src="https://img.shields.io/badge/webcomponents.org-published-blue.svg" alt="Published on WebComponents.org"></a>
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
<script type="module" src="https://cdn.jsdelivr.net/gh/vanillawc/wc-codemirror@1/index.js"></script>
```

## Demo

Try it on [WebComponents.dev](https://webcomponents.dev/edit/uQEePfQ92jOWOpupDzps?sv=1&pm=1)

## Usage

**Attributes**

- `src` - load an external source file
- `style` - CSS styling (default `height:100%;width:100%;`)
- `viewport-margin`<sup>1</sup> - sets the `viewportMargin` option of the CodeMirrror editor instance (default `10`)
- `readonly` - sets the codemirror's "readOnly" configuration attribute to true, you may set `readonly="nocursor"` if you want to disable the cursor and not let the user copy the text inside

*<sup>1</sup>Setting `viewport-margin` to `infinity` will auto-resize the editor to its contents. To see this in action, check out the [CodeMirror Auto-Resize Demo](https://codemirror.net/demo/resize.html).*

**Properties**

- `editor` - the CodeMirror editor instance
- `value` - get/set the editor's contents

*Note: The ID attribute is required when multiple editors instances are present*

### Basic Usage

An empty tag loads a basic CodeMirror editor pane

```html
<wc-codemirror></wc-codemirror>
```

### Inline Source

Inline source can be loaded by including a `<script>` of type `wc-content` in the body of the component. The `<script>` wrapper is necessary so '<' and '>' chars in the source are not interpreted as HTML.

```html
<wc-codemirror mode="javascript">
  <script type="wc-content">
  function myGoodPerson(){
     return "what can I do for you ?"
  }
  </script>
</wc-codemirror>
```

*Note: The `</script>` word cannot be used inside here, you'll have to use the escaped `&lt;/script&gt;` version instead, you may also use `&lt;script&gt;` for the opening `<script>` tag if you wish to*

### External Source

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

*Note: Check out the [CodeMirror Theme Demo](https://codemirror.net/demo/theme.html) to try sample the full selection of editor themes.*

## Contributing

See [CONTRIBUTING.md](https://github.com/vanillawc/vanillawc/blob/main/CONTRIBUTING.md)
