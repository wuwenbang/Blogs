## Web 性能优化关键指标

用户按下回车到：

1. 有内容出来时
2. DOMContentLoad 事件发生时
3. 页面可交互时
4. onLoad 事件发生时
5. 动态资源加载完成

## DNS 优化： 预解析

1. 在 `index.html` 的 `<head>` 里写 `<link> rel="dns-prefetch" href="https://abc.com/"</link>`
2. 在 `index.html` 响应头里写 `Link: <"https://abc.com/>; rel=dns-prefetch`

## TCP 优化： 连接复用

TCP 开启 -> 请求 -> 响应 -> TCP 关闭　-> TCP 开启 -> 请求 -> 响应 -> TCP 关闭

`TCP 关闭 -> TCP 开启` 这一部分时多余的。

在 HTTP 中的 Request Header 里添加 `Connection: keep-alive`
KeepAlive 设置： `KeepAlive: timeout=5,max=100` （服务器优先）

## TCP 优化： 并发连接

HTTP 1.1 协议下，并发多个 TCP 连接（有上限）

## HTTP2

- **二进制分帧**：引入了二进制**帧（Frame）**的概念，每一帧包含 Length + Type + Flags + StreamID + Payload 五部分，前四个部分固定长度为 9 Bytes，第五部分 Payload 16KB ~ 16MB 大小。
- 保留了请求和响应的概念，请求头会被发送发压缩后，分为几个 Frame 传输，头部字段会出现在 Frame 的 Payload 中；接收方合并这些 Frame 后，解压即可得到真正的请求头或者响应头。
- **数据流**：引入了**流（Stream）**的概念，一个 Stream 由多个 Frame 组成，一个 TCP 连接可以同时包含多个 Stream，一个 Stream 只包含一个请求和响应。Stream 之间不会互相影响，通过 Stream 实现了**多路复用**。
- **服务器推送**：服务端可以先发响应，客户端拿到响应结果后可以保存，之后没必要再发请求了。

## HTTP 优化

1. 资源合并：CSS 雪碧图 -> Icon Font / SVG Symbols
2. 资源内联：
   1. 小图片 -> data URL
   2. 小 CSS 文件 -> `<style>`
   3. 小 JS 文件 -> `<script>`
3. 资源压缩（gzip）：
   1. Nginx：`gzip:on`
   2. NodeJS
4. 资源精简：
   1. HTML -> 删空格、删闭合
   2. CSS -> 删未用
   3. JS -> 改局部变量名、tree shaking
   4. SVG -> 删除无用标签、属性
   5. 减少体积（有损、无损）
   6. 减少 Cookie 体积 -> 开新域名 cookie-free

## CDN 加速

## HTTP 缓存

Cache-Control:

- public / private：指定中间设备能否缓存
- max-age：缓存时间
- must-revalidate：必须对过期缓存进行校验（内容协商）

缓存与协商缓存

- 缓存：
  - Cache-Control: max-age=3600
  - Etag: ABC
- 协商缓存
  - 请求头 If-None-Match: ABC
  - 响应：304 + 空 / 200 + 新内容

服务器禁用缓存：

- Cache-Control: max-age=0,must-revalidate
- Cache-Control: no-cache （不缓存，可协商）
- Cache-Control: no-store （不缓存，不协商）

浏览器禁用缓存：

- url 后面加随机数 ?\_=abc
- Cache-Control: max-age=0,no-cache,no-store

## 代码优化技巧

### 1 代码位置

- CSS Link 标签放在开头
- JS Script 标签放在末尾

### 2 代码拆分

JS 拆分（配置 Webpack optimization 选项）:

- runtime-xxx.js（Webpack 自带运行时，例如 require 函数）
- vender-xxx.js（第三方库，例如 React Vue）
- common-xxx.js（公司级别的基础库）
- page-index-xxx.js（每个页面的 JS）

CSS 拆分：

- reset/normalize-xxx.css
- vender-xxx.css
- common-xxx.css
- page-index-xxx.css

### JS 动态导入

原生 JavaScript

```js
import('lodash').then((_) => {
  const clone = _.deepClone([1, 2, 3]);
});
```

React ： lazy + Suspense

### 图片懒加载与预加载

- 懒加载
- 预加载

### CSS 优化技巧

- 删除无用 CSS
- 使用更高效的选择器
- 减少重排
- 使用 GPU 硬件加速（transform:translate3D(0,0,0)）

### JS 优化技巧

- 尽量不要使用全局变量
- 尽量少操作 DOM
- 不要往页面插入大量的 HTML（innerHtml="longlonglong"）
- 节流和防抖
- 虚拟列表
