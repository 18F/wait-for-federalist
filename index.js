'use strict';
const fetch = require('isomorphic-fetch');

const MAIN_BRANCH = 'master';
const PROD_BASEURL = 'https://federalist-proxy.app.cloud.gov/site/';
const PREVIEW_BASEURL = 'https://federalist.fr.cloud.gov/preview/';
const COMMIT_PATH = 'commit.txt';
const MAX_TRIES = 100;
const SLEEP_MS = 2000;

module.exports = config => {

  ['user', 'repo', 'branch', 'sha'].forEach(key => {
    if (!config[key]) {
      throw new Error(
        'wait() expects "' + key + '", but it was empty: ' +
        JSON.stringify(config)
      );
    }
  });

  const repo = [config.user, config.repo].join('/').toLowerCase();

  const baseURL = (config.branch === 'master')
    ? PROD_BASEURL + repo
    : PREVIEW_BASEURL + repo + '/' + config.branch;

  console.warn('testing site URL:', baseURL);

  const commitURL = baseURL + '/' + COMMIT_PATH;

  var tries = 0;

  const check = () => {
    if (++tries >= MAX_TRIES) {
      console.error('Failed after %d tries', MAX_TRIES);
      return process.exit(1);
    }
    // console.warn('fetching:', commitURL);
    return fetch(commitURL)
      .then(res => res.text())
      .then(body => {
        return body.trim() === config.sha;
      });
  };

  const sleep = () => new Promise(resolve => {
    // console.warn('sleeping...');
    setTimeout(resolve, SLEEP_MS);
  });

  return check()
    .catch(error => {
      return sleep().then(check);
    })
    .then(ready => {
      if (ready) {
        config.url = baseURL;
        return config;
      } else {
        return sleep().then(check);
      }
    });
};
