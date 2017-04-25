#!/usr/bin/env node
const wait = require('.');
const meta = require('./metadata');
const env = process.env;

wait(meta())
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .then(data => {
    console.warn('Got SHA:', data.sha);
    process.exit(0);
  });
