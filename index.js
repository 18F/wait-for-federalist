'use strict';
const fetch = require('isomorphic-fetch');

const PROD_BRANCH = 'master';
const PROD_BASEURL = 'https://federalist-proxy.app.cloud.gov/site/';
const PREVIEW_BASEURL = 'https://federalist.fr.cloud.gov/preview/';
const COMMIT_PATH = 'commit.txt';
const TIMEOUT_S = 60; // 5 minutes
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

  const baseURL = (config.branch === PROD_BRANCH)
    ? PROD_BASEURL + repo
    : PREVIEW_BASEURL + repo + '/' + config.branch;
  config.url = baseURL;

  const commitURL = baseURL + '/' + COMMIT_PATH;

  console.warn('testing site URL:', baseURL);

  const start = Date.now();

  const check = () => {
    const seconds = (Date.now() - start) / 1000;
    if (seconds > TIMEOUT_S) {
      console.error('Failed after %s seconds', TIMEOUT_S);
      return process.exit(1);
    } else {
      // console.warn('elapsed:', seconds);
    }
    // console.warn('fetching:', commitURL);
    return fetch(commitURL)
      .catch(error => {
        return sleep().then(check);
      })
      .then(res => res.text())
      .then(body => {
        if (body.trim() === config.sha) {
          return config;
        } else {
          return sleep().then(check);
        }
      });
  };

  const sleep = () => new Promise(resolve => {
    // console.warn('sleeping...');
    setTimeout(resolve, SLEEP_MS);
  });

  return check();
};
