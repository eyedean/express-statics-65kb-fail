#!/usr/bin/env node

var http = require('http')
var serveStatic = require('serve-static')

var serveFn = serveStatic('.')

var server = http.createServer((req, res) => serveFn(req, res, () => {}));

server.listen(4001, '0.0.0.0')