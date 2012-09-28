#! /usr/bin/env node

var sys = require("util");
var fs = require("fs");

var UglifyJS = require("../tools/node");

var filename = process.argv[2];
var code = fs.readFileSync(filename, "utf8");

var ast = UglifyJS.parse(code);
ast.figure_out_scope();

var w = new UglifyJS.TreeWalker(function(node, descend){
    if (node instanceof UglifyJS.AST_Scope) {
        Object.keys(node.variables).forEach(function(name){
            var def = node.variables[name];
            sys.print(UglifyJS.string_template("Found symbol {sym}, safe to lift: {safe}\n", {
                sym: def.name,
                safe: def.safe_lift
            }));
        });
    }
});
ast.walk(w);
