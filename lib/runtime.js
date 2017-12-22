exports.shared = `
  function log(...args){console.log(...args)}
  function err(...args){console.error(...args)}
`

exports.node = `
  const __$$fs = require('fs');
  function slurp(fn){return __$$fs.readFileSync(fn, 'utf-8')}
  function die(ec){process.exit(ec)}
  ${exports.shared}
`

exports.browser = `
  function alert(a){alert(a)}
  ${exports.shared}
`
