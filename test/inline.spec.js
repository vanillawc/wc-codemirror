import test from 'tape';

(async () => {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  require('jsdom-global')(``, { pretendToBeVisual: true });
  global.customElements = window.customElements;
  await import('../index.js');

  test('Config exists(pkg) - throw if config already exists', (t) => {
    const div = document.createElement('div');
    div.style.width = '500px';
    div.style.height = '500px';

    div.innerHTML = `
      <wc-codemirror>
        <script type="wc-content">
          function myGoodPerson(){
            return "what can I do for you ?"
          }
        </script>
      </wc-codemirror>
    `;
    document.appendChild(div);
    // const wc = div.querySelector('wc-codemirror');
    // console.log(wc.editor);
    debugger;
    t.notEqual(wc, null);

    t.end();
  });
})();