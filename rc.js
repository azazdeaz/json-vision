var recast = require('recast');

var code = [
    "function add(a, b) {",
    "  return a +",
    "    // Weird formatting, huh?",
    "    b + \"fd\";",
    "}"
].join("\n");

var code2 = [
    "function add(a, b) {return b + a + 'daa'}"
].join("\n");

var ast = recast.parse(code);
var ast2 = recast.parse(code2);

ast.program.body[0] = ast2.program.body[0];

var output = recast.print(ast).code;


console.log(output);
