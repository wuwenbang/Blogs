# Express 与 Koa 联系与区别

## Express 与 Koa 的联系

`Express` 和 `Koa` 都是出自 [TJ Holowaychuk](https://github.com/tj) 大神之手。<br>
`Express` 是一个基于` Node.js` 平台的 `web` 应用开发框架。而 `Koa` 则是 `Express` 的升级版：
`Koa` 诞生之初正值 `Nodejs` 推出 `async/await` 语法之时， `Koa` 采用这种新的语法特性，丢弃回调函数，实现了了一个轻量优雅的 `web` 后端框架。<br>
两者都采用中间件方式进行开发，并且相关 `api` 基本是大同小异的。

## Express 与 Koa 的区别

### 1. 中间件模型

`Express` 的中间件模型为线型，而 `Koa` 的中间件模型为 `U` 型，也可称为洋葱模型构造中间件。<br>

- `Express` 线型模型示例：

```js
const express = require("express");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.write("hello");
  next();
});
app.use((req, res, next) => {
  res.set("Content-Type", "text/html;charset=utf-8");
  next();
});
app.use((req, res, next) => {
  res.write("world");
  res.end();
});
app.listen(3000);
```

- `Koa` 洋葱模型示例：

```js
import * as Koa from "koa";
const app = new Koa();
app.use(async (ctx, next) => {
  ctx.body = "hello";
  await next();
  ctx.body += "world";
});
app.use(async (ctx) => {
  ctx.set("Content-Type", "text/html;charset=utf-8");
});
app.listen(3000);
```

可以看到，`Express`实现同样的功能，要比`Koa`多一步。

### 2. 异步方式

- `Express` 通过回调实现异步函数，在多个回调、多个中间件中写起来容易逻辑混乱。

```js
// express写法
app.get("/test", function (req, res) {
  fs.readFile("/file1", function (err, data) {
    if (err) {
      res.status(500).send("read file1 error");
    }
    fs.readFile("/file2", function (err, data) {
      if (err) {
        res.status(500).send("read file2 error");
      }
      res.type("text/plain");
      res.send(data);
    });
  });
});
```

- `Koa` 通过 `generator` 和 `async/await` 使用同步的写法来处理异步，明显好于 `callback` 和 `promise`。

```js
app.use(async (ctx, next) => {
  await next();
  var data = await doReadFile();
  ctx.response.type = "text/plain";
  ctx.response.body = data;
});
```

### 3. 捕获错误

- `Express` 沿用 `Node.js` 的 `Error-First` 的模式（第一个参数是 `error` 对象）来捕获错误。

```js
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

- `Koa` 使用 `try/catch` 的方式来捕获错误。

```js
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error.errorCode) {
      console.log("捕获到异常");
      return (ctx.body = errror.msg);
    }
  }
});
```

### 4. 响应机制

- `Express` 立刻响应（`res.json`/`res.send`），上层不能再定义其他处理。
- `Koa` 中间件执行完之后才响应（`ctx.body = xxx`），每一层都可以对响应进行自己的处理

## 总结

| 区别       | Express                  | Koa                          |
| ---------- | ------------------------ | ---------------------------- |
| 中间件模型 | 线性模型                 | 洋葱模型                     |
| 异步方式   | 基于回调函数             | 基于 async/await             |
| 捕获错误   | Error-First 模式         | 使用 try/catch 的方式        |
| 响应机制   | 立刻响应                 | 中间件执行完之后才响应       |
| 集成成度   | 集成度高，自带部分中间件 | 集成度低，没有捆绑任何中间件 |
