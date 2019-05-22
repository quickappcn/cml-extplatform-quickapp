const styleParser = require('../styleParser');

let content = `
.test {
  font-size: 24cpx;
  lines: 1;
  background: url("http://10.16.20.240:8000/quickapp/static/img/chameleon_83ee00e.png") no-repeat;
}
`

let result = styleParser(content);
console.log(result);