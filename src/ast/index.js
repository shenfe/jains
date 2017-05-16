const babylon = require('babylon');
const traverse = require('babel-traverse').default;

var astCache = {};

var codeLengthRecord = {};

var astify = function (code, fileName, forced) {
    var options = {
        sourceType: 'script'
    };
    if (fileName) {
        var prevCodeLen = codeLengthRecord[fileName];
        codeLengthRecord[fileName] = code.length;
        if (astCache[fileName] && !forced
            && !(typeof prevCodeLen === 'number'
                && prevCodeLen !== code.length)) {
            return astCache[fileName];
        }
        options.sourceFileName = fileName;
    }
    var ast = babylon.parse(code, options);
    if (fileName) {
        astCache[fileName] = ast;
    }
    return ast;
};

var visitors = {
    enter(path) {
        //TODO
    },
    FunctionDeclaration: function (path) {
        console.log('FunctionDeclaration');
    },
    FunctionExpression: function (path) {
        console.log('FunctionExpression');
    },
    ArrowFunctionExpression: function (path) {
        console.log('ArrowFunctionExpression');
    }
};

var signVisitor = function (type, handler) {
    if (typeof visitors[type] !== 'function') {
        visitors[type] = handler;
    } else {
        var alreadyOne = visitors[type];
        visitors[type] = function (path) {
            alreadyOne(path);
            handler(path);
        };
    }
    return visitors;
};

var travel = function (ast) {
    return traverse(ast, visitors);
};

module.exports = {
    astify,
    visitors,
    signVisitor,
    traverse: travel
};
