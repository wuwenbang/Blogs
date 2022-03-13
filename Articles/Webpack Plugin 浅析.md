# Plugin 是什么

Plugin 是 Webpack 中的扩展器，在 Webpack 运行的生命周期中会广播出许多钩子事件，Plugin 可以监听这些事件，并挂载自己的任务，也就是注册事件。当 Webpack 构建的时候，插件注册的事件就会随着钩子的触发而执行了。

## Plugin 与 Loader 的区别

### Plugin 与 Loader 功能不同

- Loader 是一个转换器：能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中。
- Plugin 是一个扩展器：赋予了 webpack 各种灵活的功能，例如打包优化、资源管理、环境变量注入等，目的是解决 loader 无法实现的其他事。

### Plugin 与 Loader 运行时机不同

![image](https://static.vue-js.com/9a04ec40-a7c2-11eb-ab90-d9ae814b240d.png)
可以看到，两者在运行时机上的区别：

- Loader 运行在打包文件之前
- Plugin 在整个编译周期都起作用

# Plugin 的使用

## Plugin 配置方式

在 `webpack.config.js` 文件中，通过 Webpack 配置对象的 `plugins` 属性进行配置，`plugins` 为一个数组，其元素要求为插件对象 Plugin 的实例，配置参数可以通过 Plugin 在实例化时的构造参数进行传递，例如配置 `html-webpack-plugin` 如下：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
  ],
};
```

## 常见的 Plugin

### 1 html-webpack-plugin（HTML 文件生成插件）

- 背景：多入口时，当你的 `index.html` 引入多个 `js` 文件，如果这些生成的 `js` 名称构成有 `[hash]` ，那么每次打包后的文件名都是变化的。
- 作用：可以用于自动重新生成一个 `index.html` ，并帮你把所有生产的 `js` 文件引入到 `html` 中，最终生成到 `output` 目录。
- 安装：

```sh
yarn add --dev html-webpack-plugin
```

- 配置：

```js
//引入
const HtmlWebpackPlugin = require('html-webpack-plugin');
//配置
module.exports = = {
  // ...
  plugins: [
    new HtmlWebpackPlugin(),
  ],
};
```

### 2 mini-css-extract-plugin（css 提取插件）

- 背景：在进行打包时，CSS 代码会打包到 JS 中，不利于文件缓存。
- 作用：依据每个 entry 生成单个 CSS 文件（将 CSS 从 JS 中提取出来）。
- 安装：

```sh
yarn add --dev mini-css-extract-plugin
```

- 配置：

```js
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
module.exports = = {
  // ...
  plugins: [
    new MiniCssExtractPlugin(),
  ],
};

```

### 3 imagemin-webpack-plugin（图片压缩插件）

- 背景：图片过大，加载速度慢，浪费存储空间。
- 作用：批量压缩图片。
- 安装：

```sh
yarn add --dev imagemin-webpack-plugin
```

- 配置：

```js
const ImageminPlugin = require('imagemin-webpack-plugin').default;
module.exports = {
  // ...
  plugins: [
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production', // 开发时不启用
      pngquant: {
        //图片质量
        quality: '95-100',
      },
    }),
  ],
};
```

### 4 clean-webpack-plugin（清空文件夹插件）

- 背景：每次进行打包需要手动清空目标文件夹。
- 作用：每次打包时先清空 `output` 文件夹。
- 安装：

```sh
yarn add --dev clean-webpack-plugin
```

- 配置：

```js
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  // ...
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 自动清空 dist 文件夹
  plugins: [new CleanWebpackPlugin(['dist'])],
};
```

### 5 copy-webpack-plugin（文件复制插件）

- 背景：一些静态资源（图片、字体等），在编译时，需要拷贝到输出文件夹。
- 作用：用来复制文件或文件夹。
- 安装：

```sh
yarn add --dev copy-webpack-plugin
```

- 配置：

```js
// 引入
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new CopyPlugin([
      { from: 'assets', to: 'dist' },
      { from: 'images/xxx.png', to: 'dist' },
    ]),
  ],
};
```

### 6 compression-webpack-plugin（gzip 压缩插件）

- 背景：所有现代浏览器都支持 `gzip` 压缩，启用 `gzip` 压缩可大幅缩减传输资源大小，从而缩短资源下载时间，减少首次白屏时间，提升用户体验。
- 作用：用来对一些文本文件（JS CSS HTML）文件进行 `gzip` 压缩。
- 安装：

```sh
yarn add --dev compression-webpack-plugin
```

- 配置：

```js
// 引入
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new CompressionPlugin({
      // gzip压缩配置
      test: /\.js$|\.html$|\.css/, // 匹配文件名
      threshold: 10240, // 对超过10kb的数据进行压缩
      deleteOriginalAssets: false, // 是否删除原文件
    }),
  ],
};
```

# 参考文档

- [Webpack 官方文档 Plugin](https://webpack.js.org/concepts/plugin/)
- [webpack 常用插件](https://juejin.cn/post/6844903918862860301)
