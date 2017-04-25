const markers = {
  CIRCLE_BRANCH: {
    user:   'CIRCLE_PROJECT_USERNAME',
    repo:   'CIRCLE_PROJECT_REPONAME',
    branch: 'CIRCLE_BRANCH',
    sha:    'CIRCLE_SHA1',
  },
};

const mapenv = (vars, env, dest) => {
  return Object.keys(vars).reduce((acc, key) => {
    const name = vars[key];
    acc[key] = env[name];
    return acc;
  }, dest || {});
};

module.exports = config => {
  const env = process.env;
  return Object.keys(markers).reduce((acc, key) => {
    if (env[key]) {
      return mapenv(markers[key], env, acc);
    } else {
      console.warn('env var "%s" is not set; skipping', key);
    }
    return acc;
  }, config || {});
};
