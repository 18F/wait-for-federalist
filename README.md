# wait-for-federalist
A utility to wait for Federalist builds before running CI tests, and tell your builds where to look based on the current branch.

:warning: Currently this only works on Circle CI, but could be easily modified to accommodate other services. See [metadata.js](metadata.js) for how this is currently done.

## Install
You can install it with npm or [Yarn](https://yarnpkg.org):

```sh
npm install --save-dev wait-for-federalist
# or with Yarn:
yarn add wait-for-federalist
```

## CLI
The `wait-for-federalist` CLI performns the following steps:

1. Determine the repository owner, name, branch, and most recent commit SHA from the environment.
1. Compose a base URL depending on the branch:
  * If the branch is `master`, the base URL is `https://federalist-proxy.app.cloud.gov/site/{owner}/{name}`.
  * Otherwise, the base URL is `https://federalist.fr.cloud.gov/preview/{owner}/{name}/{branch}`.
1. Request `{baseURL}/commit.txt` every 2 seconds until its contents match the most recent commit SHA, or the timeout is reached.

`wait-for-federalist` writes the base URL to stdout, so you can redirect it to a file or pipe it to another process.

## CircleCI
The recommended setup on CircleCI is the following:

```yml
machine:
  node:
    version: 4

test:
  override:
    - $(npm bin)/wait-for-federalist > site_url.txt
```

Then, in the `test.override` section, do something with `site_url.txt`, for instance:

```sh
# if you need the site URL as an environment variable
    - SITE_URL=$(cat site_url.txt) npm run test-ci
# if you need it as an argument
    - npm run test-ci -- --url $(cat site_url.txt)
```
