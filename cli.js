#!/usr/bin/env node
const wait = require('.');
const meta = require('./metadata');
const env = process.env;

console.warn('waiting for Federalist...');

wait(meta())
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .then(data => {
    console.warn('Federalist built:', data);
    env.SITE_URL = data.url;
    process.exit(0);
  });
