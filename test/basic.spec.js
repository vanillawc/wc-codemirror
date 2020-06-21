import test from 'tape';

(async () => {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  require('jsdom-global')('', { pretendToBeVisual: true });
  global.customElements = window.customElements;
  await import('../index.js');

  function createMockDiv (width, height) {
    const div = document.createElement("div");
    Object.assign(div.style, {
      width: width+"px",
      height: height+"px",
    });
    // we have to mock this for jsdom.
    div.getBoundingClientRect = () => ({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
    });
    return div;
  }

  test('Config exists(pkg) - throw if config already exists', async (t) => {

    const div = createMockDiv(500, 500);
    div.innerHTML = `
      <wc-codemirror></wc-codemirrror>
    `;
    document.body.appendChild(div);
    await new Promise(resolve => setTimeout(resolve, 50));

    const wc = document.querySelector('wc-codemirror');
    debugger;
    t.notEqual(wc, null);

    t.end();
  });
})();
