const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./Juego-Plataformas/index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "Juego-Plataformas/img", to: "img" },
        { from: "Juego-Plataformas/css", to: "css" },
        { from: "Juego-Plataformas/js/vendor", to: "js/vendor" },
        { from: "Juego-Plataformas/icon.svg", to: "icon.svg" },
        { from: "Juego-Plataformas/icon.ico", to: "favicon.ico" },
        { from: "Juego-Plataformas/robots.txt", to: "robots.txt" },
        { from: "Juego-Plataformas/icon.png", to: "icon.png" },
        { from: "Juego-Plataformas/site.webmanifest", to: "site.webmanifest" },
      ],
    }),
  ],
});
