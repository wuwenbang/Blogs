## Babel

code1 -> (parse) -> ast1 -> (traverse) -> ast2 -> (generator) -> code2

1. parse 通过 Code 生成 AST
2. traverse 遍历 AST 对某个语句做操作（enter）
3. generate 通过 AST 生成 Code

- @babel/parse
- @babel/traverse
- @babel/generator
- @babel/core 包含前三者
- @babel/preset-env 内置很多规则

## 依赖收集

1. 用哈希表存储文件依赖
2. 用递归来获取嵌套依赖
   递归存在调用栈溢出的风险
3. 避免循环依赖
   静态分析：如果分析过（ map 中存在 key ），则 return。

## 打包（Bundle）

1. ESModule 语法 -> CommonJS 规则
   1. import 关键字 -> require 函数
   2. export 关键字 -> exports 对象
2. 把不同文件的代码放到一个文件的数组里，然后遍历数组执行代码。
   1. import 文件 == execute 文件
   2. `code(require, module, exports)`

## 打包 CSS

1. 将 CSS 内容转为 JS 字符串
2. 创建 style 标签，挂载 CSS 内容

```js
const str = ${JSON.stringfy(code)}
if(document){
   const style = document.createElement('style')
   style.innerHTML = str
   document.head.appendChild(style)
}
```

3. css-loader

   1. loader 可以是一个普通函数
   2. loader 可以是一个异步函数

4. style-loader

   1. pitch 钩子函数

5. 常用 loader

   1. sass-loader -> css-loader -> style-loader
   2. less-loader -> css-loader -> style-loader
   3. ts-loader / awesome-typescript-loader
   4. markdown-loader
   5. html-loader
   6. raw-loader
   7. vue-loader

6. 思考题 `import logo from 'images/logo.png'`

   1. 拷贝文件至 public，将相对路径赋值给 logo
   2. 直接转译为 base64 格式导入

7. 面试题：Webpack 的 loader 是什么？
   1. Webpack 自带的打包器只支持 JS 文件
   2. 当我们想要加载 css/less/scss/ts/md 文件时，就需要使用 loader
   3. loader 的原理就是把文件内容包装成能运行的 JS 文件
   4. 加载 css 需要用到 style-loader 和 css-loader
8. Tapable: Webpack 事件/钩子库

## Webpack 流程

1. init
2. run
3. compile
4. compilation
5. make
6. afterCompile
7. seal
8. codeGeneration
9. emit
10. done

## Webpack Loader 与 Plugin

- Loader
  - 转换器
  - 用于文件转换，将非 JavaScript 文件转化为 JavaScript 文件。
- Plugin
  - 扩展器
  - 在 webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。

## Webpack 优化技巧 Code Split

1. 单独打包 runtime
   1. 不单独打包：runtime 在 main.js 中
   2. 单独打包：runtime.js 和 main.js 分离
   3. 更新 runtime.js 不会影响 main.js 的缓存
2. 单独打包 node_modules(verdors)
3. 多页面优化技巧： `common chunks`

```js
 optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          priority: 10,
          minSize: 0, /* 如果不写 0，由于 React 文件尺寸太小，会直接跳过 */
          test: /[\\/]node_modules[\\/]/, // 为了匹配 /node_modules/ 或 \node_modules\
          name: 'vendors', // 文件名
          chunks: 'all',  // all 表示同步加载和异步加载，async 表示异步加载，initial 表示同步加载
          // 这三行的整体意思就是把两种加载方式的来自 node_modules 目录的文件打包为 vendors.xxx.js
          // 其中 vendors 是第三方的意思
        },
        common: {
          priority: 5,
          minSize: 0,
          minChunks: 2,
          chunks: 'all',
          name: 'common'
        }
      },
    },
  },

```

## Webpack 多页面

多页面打包的原理就是：配置多个 `entry` 和多个 `HtmlWebpackPlugin`

```js
module.exports = {
  entry: {
    page1: './src/pages/page1/app.js', // 页面1
    page2: './src/pages/page2/app.js', // 页面2
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name]/[name]-bundle.js', // filename不能写死，只能通过[name]获取bundle的名字
  },
};
```

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/page1/index.html',
      chunks: ['page1'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/page2/index.html',
      chunks: ['page2'],
    }),
  ],
};
```