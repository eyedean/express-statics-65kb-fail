#!/usr/bin/env node

const express = require('express')

const app = express()
app.use('/', express.static('.'))
// app.disable('x-powered-by'); // Uncommenting this line fixes the issue, but it's a band-aid
app.listen(4002, '0.0.0.0', () => console.log("serving..."));
