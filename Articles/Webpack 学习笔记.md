
## Babel

node1 -> (parse) -> ast1 -> (traverse) -> ast2 -> (generator) -> node2

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
