# JavaScript 异步解决方案 Promise 全解析

## Promise 是什么？

`Promise` 是一个 JS 的异步编程解决方案，解决了传统异步编程回调地狱的问题。 从语义上来说：`Promise` 是一个向外部传达异步编程操作消息的对象。

## Promise 的三种状态

`Promise` 对象表示一个异步操作，拥有三种状态：

1. `pending`（进行中）
2. `fulfilled`（已完成）
3. `rejected`（已失败）

只有异步操作的结果可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。 其中 `pending` 为初始状态，状态的变化只有两种：

1. `pending` -> `fulfilled`（异步任务完成）
2. `pending` -> `rejected`（异步任务失败）

且一旦状态改变，状态就会凝固，不会再变化了。这就导致 Promise 一旦建立就会立即执行，**无法取消**。

## Promise 的基本用法

ES6 规定 Promise 是一个构造函数，用来生成 `Promise` 对象实例。

```JS
const promise = new Promise(function(resolve,reject){
    // 异步操作
    if(success){    //异步操作成功
        resolve(value);
    } else{         //异步操作失败
        reject(err);
    }
})
```

`Promise` 构造函数接收的参数是一个函数，该函数有两个由 JS 引擎指定的参数：`resolve` 函数 和 `reject` 函数

- `resolve` 函数 有两个作用：
  1. 将 Promise 状态由 `pending` -> `fulfilled`（等待态 -> 成功态）
  2. 将异步操作成功的结果 value 作为参数传递出去。（由后面讲的的 then 方法接收）
- `reject` 函数 也有两个作用：
  1. 将 Promise 状态由 `pending` -> `rejected`（等待态 -> 失败态）
  2. 将异步操作失败的错误信息 `err` 作为参数传递出去。（由后面讲的的 `then` /`catch` 方法接收）

## Promise 的三个实例方法 then catch finally

### 1. Promise.prototype.then()

`Promise` 实例具有 `then` 方法，也就是说 `then` 方法时定义在原型对象上的。
`Promise` 实例生成后，可以用 `then` 方法分别指定 `resolve` 状态和 `rejected` 状态的回调函数：获取 `Promise` 内部的异步操作状态。

```js
promise.then(
  function (value) {
    console.log(value); //异步操作成功时（fulfilled 态）调用
  },
  function (err) {
    console.log(err); //异步操作失败时（rejected 态）调用
  }
);
```

`then` 方法可以接收两个回调函数作为参数：

第一个回调函数在 `promise` 实例变为 `fulfilled` 时调用，并获取 `resolve` 函数传递的参数 `value。`
第二个回调函数在 `promise` 实例变为 `rejected` 时调用，并获取 `reject` 函数传递的参数 `err。`
then 方法的返回值是一个新的 `Promise` 对象，因此可以 `.then` 可以**链式调用**。

### 2. Promise.prototype.catch()

`Promise` 实例的 `catch` 方法用于指定发生错误时的回调函数，是 `.then(null, rejection)` 的语法糖。

```js
promise
  .then(function (val) {
    console.log(val); //异步操作成功时（fulfilled 态）调用
  })
  .catch(function (err) {
    console.log(err); //异步操作失败时（rejected 态）调用
  });
```

上面代码中， 如果 `promise` 对象状态变为 `fulfilled` ，则会调用 `then` 方法指定的回调函数；如果异步操作抛出错误，状态就会变为 `rejected` ，就会调用 `catch` 方法指定的回调函数。另外，`then` 方法指定的回调函数，如果运行抛出错误，也会被 `catch` 方法捕获。

```js
promise
  .then((val) => console.log("fulfilled：", val))
  .catch((err) => console.log("rejected：", err));
// 等价于
promise
  .then((val) => console.log("fulfilled：", val))
  .then(null, (err) => console.log("rejected：", err));
```

如果 `Promise` 状态已经变成 `resolved`，再抛出错误是无效的。因为 `Promise` 的状态一旦改变，就永久保持该状态，不会再变了。
`Promise` 对象的错误具有冒泡性质，会一直向后传递，直到被捕获为止，也就是说错误总会被下一个 `catch` 语句捕获。

### 3. Promise.prototype.finally()

`Promise` 实例的 `finally` 方法用于指定不管状态最终如何，都会执行的函数。是 `.then(function,function)`（`function` 相同）的语法糖。

```js
promise.finally((message) => console.log("状态变化了", message));
// 等价于
promise.then(
  (message) => console.log("状态变化了", message),
  (message) => console.log("状态变化了", message)
);
// 无论成功还是失败都会执行
```

## Promise 的两个静态方法 all 和 race

### 1. Promise.all()

`Promise.all(arr)` 方法是挂载在 `Promise` 构造函数上的静态方法，它传入参数为一个 `Promise` 对象数组 `arr`，返回值为一个 `Promise` 实例：

该实例会在 `Promise` 对象数组 内所有对象的状态变为 `fulfilled` 时调用内部的 `resolve` 函数;
该实例在 `Promise` 对象数组 内任意对象的状态变为 `rejected` 时调用 `reject` 函数（`reject` 函数的参数为第一个错误的 `promise` 对象的 `err`）;
有点类似于 `JS` 里的与操作`（&&）`：所有表达式为真时返回真，任意表达式为假时返回假。

```js
let p1 = new Promise((resolve,reject)=>{
resolve('p1-success'),
})
let p2 = new Promise((resolve,reject)=>{
resolve('p2-success'),
})
let p3 = new Promise((resolve,reject)=>{
reject('p1-error'),
})

Promise.all([p1,p2,p3]).then(val=>{
console.log(val)
}).catch(err=>{
console.log(err)
})

//输出 p1-error
```

需要特别注意的是，`Promise.all()` 获得的成功结果的数组里面的数据顺序和 `Promise.all()` 接收到的数组顺序是一致的，即 `p1` 的结果在前，即便 `p1` 的结果获取的比 `p2` 要晚。这带来了一个绝大的好处：在前端开发请求数据的过程中，偶尔会遇到发送多个请求并根据请求顺序获取和使用数据的场景，使用 `Promise.all()` 毫无疑问可以解决这个问题。

### 2. Promise.race()

`Promise.race(arr)` 方法返回一个 `promise` 实例，一旦 `arr` 中的某个 `promise` 对象解决或拒绝，返回的 `promise` 就会解决或拒绝。
顾名思义，Promise.race 就是赛跑的意思，意思就是说，`Promise.race([p1, p2, p3])`里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1-success");
  }, 1000);
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p2-success");
  }, 500);
});
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("p3-error");
  }, 1000);
});

Promise.race([p1, p2, p3])
  .then((val) => {
    console.log(val);
  })
  .catch((err) => {
    console.log(err);
  });

//输出 p2-success
```
