const path = require("path");

const { name } = require("./package");

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = "umd";
    config.output.jsonpFunction = `webpackJsonp_${name}`;
    config.output.globalObject = "window";

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };

    let rule = config.module.rules.find((rule) => rule.oneOf);
    const ruleBabel = rule.oneOf[1];
    ruleBabel.options.plugins.push([
      "styled-jsx/babel",
      { optimizeForSpeed: true },
    ]);

    return config;
  },

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.disableHostCheck = true;
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      config.historyApiFallback = true;
      config.hot = true;
      config.open = false;

      return config;
    };
  },
};
