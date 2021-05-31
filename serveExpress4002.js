#!/usr/bin/env node

const express = require('express')

const app = express()
app.use('/', express.static(__dirname))
app.listen(4002, '0.0.0.0', () => console.log("serving..."));
