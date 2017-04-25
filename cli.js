#!/usr/bin/env node
const wait = require('.');
const meta = require('./metadata');

console.warn('waiting for Federalist...');

wait(meta())
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .then(data => {
    console.warn('Federalist is ready to test at:');
    console.log(data.url);
    process.exit(0);
  });
