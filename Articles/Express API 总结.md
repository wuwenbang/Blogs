## express API 分类

`express API` 可以分为五大类：

1. `express.xxx`：`express`内置的中间件
2. `app.xxx`：操作应用
3. `req.xxx`：操作请求
4. `res.xxx`：操作响应
5. `router.xxx`：操作路由（缩减版 app.xxx）

## 1. express 相关 API

### 1. express.json()

用于解析 JSON 格式的数据的中间件。

```js
app.use(express.json());
```

### 2. express.static(root,[options])

用于开启一个静态服务器的中间件。

```js
app.use(express.static("public"));
```

## app 相关 API

### 1. app.use()

用于使用 `express` 中间件，即执行一个参数为 `req`，`res`和`next`的函数。

```js
app.use(function (req, res, next) {
  console.log("req method:", req.method);
  res.send("hello world!");
  next();
});
```

### 2. app.listen()

用于监听指定的端口.

```js
app.listen(3000, () => {
  console.log("listen 3000");
});
```

### 3. app.METHOD()

用于路由某个方法（GET、POST、PUT、DELETE）的请求。

```js
app.get("/test", (req, res, next) => {
  res.send("hello!");
});
app.post("/user", (req, res, next) => {
  res.json({ name: "tom" });
});
```

### 4. app.all()

用于路由全部类型的请求。

```js
app.all("test", (req, res, next) => {
  res.send("hello!");
});
```

### 5. app.set(name, value)

用于设置变量 `name` 的值设为 `value。`

```js
app.set("key", "test");
```

### 6. app.get(name)

用于获取变量 `name` 的值。

```js
app.get("key"); // test
```

## request 相关 API

### 1. req.params

用于获取预设好的 url 路径参数，列如：请求路径为 `/user/:id`，可以通过 `req.params.id` 获取参数`id`的值。

### 2. req.query

用于获取 url 查询参数对象，列如：请求路径为 `/detail?name=test`，可以通过 `req.query` 获取参数查询参数对象`{ name:test }`。

### 3. req.body

用于获取解析过的请求体。

### 4. req.route

用于获取当前的路由对象，包括原始路径字符串、产生的正则、请求方法、查询参数等。

### 5. req.cookies

用于获取请求中包含的`cookie`，可以配合 `cookieParaser()` 中间件使用，默认值为空对象。

### 6. req.get(field)

用于获取请求头里的 `field` 的值，注意是大小写不敏感的，

```js
app.use((req, res, next) => {
  const contentType = req.get("Content-Type");
});
```

### 7.req.range(size)

用于分片并发下载资源。

## response 相关 API

### 1. res.status()

用于设置响应码，可以链式调用。

```js
app.use((req, res, next) => {
  res.status(403).end();
  res.status(400).send("Bad Request");
  res.status(404).sendFile("/absolute/path/to/404.png");
});
```

### 2. res.send(body)

用于发送响应。

```js
res.send("text"); // text
res.send({ name: "tom" }); // {"name":"hi"}
res.send("<p>hello world!</p>"); // >hello world!
```

### 3. res.json(body)

用于返回一个 json 对象，会自动设置响应头`Content-Type: text/json`

```js
res.json({ name: "tom" });
```

### 4. res.set(name.value)

用于设置响应头的内容。

```js
res.set("Content-Type", "text/plain");
res.set({
  "Content-Type": "text/html",
  "Content-Length": "200",
});
```

### 5. res.redirect([, status],url)

用于重定位到新的地址。

```js
res.redirect("www.google.com");
res.redirect(301, "www.google.com");
```

### 6. res.cookie(name, value [, options])

用于设置响应的 `cookie` 内容。

```js
res.cookie("name", "hello world");
res.cookie("test", "welcome test", {
  domain: ".example.com",
  path: "/admin",
  secure: true,
});
```

## router 相关的 API

一个 `router` 对象是一个单独的实例，可以认为是一个 `"mini-application"`，具有操作中间件和路由方法的能力，每一个 `express` 程序有一个内建的 `app` 路由，路由自身表现为一个中间件，所以可以使用它作为 `app.use()` 方法的一个参数或者作为另一个路由的 `use()` 的参数。
创建路由：

```js
// 创建路由
const router = express.Router([options]);
// 挂载路由
app.use("/index", router);
```

### 1. router.all()

用于路由全部请求，与`app.all`类似。

### 2. router.METHOD()

用于路由某个方法（GET、POST、PUT、DELETE）的请求，与`app.all`类似。

### 3. router.param(name,callback)

用于给路由参数添加回调触发器，`name` 指的是参数名，`callback` 是回调方法。

```js
router.param("id", function (req, res, next, id) {
  console.log("called only once");
});
```

### 4. router.route(path)

用于返回一个单例模式的路由的实例，之后可以在其上施加各种 HTTP 动作的中间件，与 `app.route` 类似。

```js
router
  .route("/users/:user_id")
  .all(function (req, res, next) {
    next();
  })
  .get(function (req, res, next) {
    res.json(req.user);
  })
  .put(function (req, res, next) {
    req.user.name = req.params.name;
    res.json(req.user);
  })
  .post(function (req, res, next) {
    next(new Error("not implemented"));
  })
  .delete(function (req, res, next) {
    next(new Error("not implemented"));
  });
```

### 5. route.use()

用于使用中间件，与`app.use`类似。
