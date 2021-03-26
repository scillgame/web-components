const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  const files = [
    './dist/scill-web-components/main.js',
    './dist/scill-web-components/polyfills.js',
    './dist/scill-web-components/runtime.js',
  ]
  await fs.ensureDir('dev-elements');
  await concat(files, 'dev-elements/scill-dev-widgets.js');
  await fs.copyFile('./dist/scill-web-components/styles.css', 'dev-elements/scill-dev-widgets.css')
  //await fs.copy('./dist/scill-web-components/assets/', 'elements/assets/' )
})()
