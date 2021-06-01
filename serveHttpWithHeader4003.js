#!/usr/bin/env node

var http = require('http')
var serveStatic = require('serve-static')

var fs = require("fs");
var fileContent = fs.readFileSync("./assets/a.txt");

var serveFn = serveStatic('.')
var server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'text/plain;charset=utf-8');
	res.setHeader('Content-Length', Buffer.byteLength(fileContent, 'utf-8'));
	res.setHeader("X-POWERED-BY", "me-testing");
	res.write(fileContent.toString());
	res.end();
	// serveFn(req, res, (req, res) => { });
});

server.listen(4003, '0.0.0.0')