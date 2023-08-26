const path = require("path");
const webpack = require("webpack");
// nodes는 자바스크립트 실행기, 서버와 같은 것만은 아님
// webpack은 어마어마 하게 많은 js 파일을 하나의 파일로 합쳐주는 라이브러리임
module.exports = {
  mode: "development",
  devtool: "inline-source-map", // hidden-source-map
  resolve: {
    extensions: [".jsx", ".js"],
  },

  entry: {
    app: "./client",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: ["> 1% in KR"], // browserslist
                },
                debug: true,
              },
            ],
            "@babel/preset-react",
          ],
          plugins: [],
        },
      },
    ],
  },
  output: {
    filename: "app.js",
    path: path.join(__dirname, "dist"),
  },
};
