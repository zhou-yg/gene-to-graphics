const config = {
  "env": {
    "pro1": {
      "presets": [
        "env",
        "stage-2"
      ],
      "plugins": [
        "transform-es2015-spread"
      ],
      "comments": false
    },
    "dev1": {
      "presets": [
        "@vue/app"
      ],
      "plugins": [
        "transform-vue-jsx",
        "@babel/plugin-proposal-object-rest-spread"
      ],
      "comments": false
    },
  },
}

console.log('process.env.BABEL_ENV:', process.env.BN);

module.exports = config.env[process.env.BN];
