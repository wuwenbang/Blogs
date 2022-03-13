# 1. Loader 是什么

Loader 是 Webpack 中的文件加载器。

## Loader 的作用

Webpack 是一个模块化打包工具，但是其只能直接处理 JavaScript 格式的代码。任何非 JavaScript 文件（例如 TypeScript CSS SASS JSX）都必须被预先处理转换为 JavaScript 代码，才可以参与打包。而 Loader 文件加载器，能够加载资源文件，并对这些文件进行特定的处理，然后打包的指定文件中。

例如 `ts-loader` 可以将 TypeScript 转换为 JavaScript 代码：

TypeScript -> (ts-loader) -> JavaScript

## Loader 的本质

Loader 本质上是导出函数的 JavaScript 模块：

```js
/**
 * @param {string|Buffer} content 源文件的内容
 * @param {object} [map]  SourceMap 数据，用于定位源码
 * @param {any} [meta] meta 数据，可以是任何内容
 */
function webpackLoader(content, map, meta) {
  // 你的webpack loader代码
}
module.exports = webpackLoader;
```

基于所导出的函数，我们可以实现对源文件内容 `content` 的转换：函数 `return` 的就是转换的结果。

# 2. Loader 使用方式

## Loader 三种使用方式

1. 配置（推荐）：在 `webpack.config.js` 文件中指定 loader。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
};
```

2. 内联：在每个 import 语句中显式指定 loader。
   可以在 `import` 语句或任何等效于 "import" 的方式中指定 loader。使用 `!` 将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。

```js
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

3. 命令行：在 shell 命令中指定它们。

```sh
webpack --module-bind 'css=style-loader!css-loader'
```

这样会对 `.css` 文件使用 `style-loader` 和 `css-loader`。

## Loader 执行顺序

Loader 遵循如下规则执行：从右到左，从下到上。

例如上述 Loader 的执行顺序就是： css-loader -> style-loader。

# 3. Webpack 常用 Loader

- 样式：style-loader、css-loader、sass-loader 等
- 文件：raw-loader、file-loader、url-loader 等
- 编译：babel-loader、vue-loader、ts-loader 等
- 校验测试：eslint-loader、mocha-loader 等

## 样式 Loader

例如我们需要处理 `.sass` 文件，则需要经历一下三个 Loader ：

1. sass-loader: 将 `.sass` 文件转换为 `.css` 文件
2. css-loader: 将`.css` 文件内容转换为 JS 的字符串并作为 JS 模块导出
3. style-loader: 将 `css` 字符串以 `style` 标签的方式插入 DOM 树中

实现以上三个 Loader 的配置如下：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ca]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
```

## 文件 Loader

- raw-loader：加载文件原始内容（utf-8），返回 `JSON.stringify` 后的内容。
- file-loader：主要作用是将指定文件拷贝到输出文件夹。
- url-loader：url-loader 在 file-loader 的基础上加了一个 `data URL` 的功能。传给 url-loader 一个限制值，如果处理的文件小于这个值，loader 将会把文件转化为 `base64` 的 `data URL` 输出。大于限制的文件则交给引入的 file-loader 处理。

## 编译 Loader

- babel-loader：默认用来处理 ES6 语法，将其编译为浏览器可以执行的 JS 语法。
- vue-loader：用来将 `.vue` 文件处理为 JS 可以识别的模块。
- ts-loader：用来将 `.ts` 文件处理为 JS 可以识别的语法。

## 校验测试 Loader

- eslint-loader：允许 Eslitn 对 JS 文件做语法检查。
- mocha-loader：允许通过 Webpack 加载和运行 `Mocha Test`。

# 参考文档

- [Webpack 官方文档 Loaders](https://webpack.js.org/concepts/loaders/)
