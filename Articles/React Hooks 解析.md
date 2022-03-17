# 1. React 核心公式

当我们在使用 React 函数组件构筑视图的时候，我们到底在干什么呢？
大部分时间我们其实是在定义函数（函数组件），然后把写好的函数丢进 `ReactDOM.render()` 里去渲染，就像这样：

```js
// 定义函数组件
function App() {
  return <div>Hello World!</div>;
}
// 渲染函数组件
ReactDOM.render(<App />, document.getElementById('root'));
```

然后 React 帮助我们将函数执行的结果（在函数内部 return 的 HTML 内容）渲染到视图上，所以 React 的核心功能可以用一个简单的公式概括：

`UI = f()`

即视图等于一个函数执行的结果。

再介绍后续 Hooks 相关内容之前，首先介绍两个概念：纯函数和副作用函数。

- 纯函数（ Pure Function ）：对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，这样的函数被称为纯函数。
- 副作用函数（ Side effect Function ）：如果一个函数在运行的过程中，除了返回函数值，还对主调用函数产生附加的影响（例如访问外部变量，发起 HTTP 请求，操作 DOM 等等），这样的函数被称为副作用函数。

在没有引入 Hooks 之前，函数式组件还是一个纯函数（相同的输入永远获得相同的输出），我们称这样的函数组件为**纯函数组件**。

# 2. 状态 useState

现在我们已经可以通过 React 渲染一个页面了，然而他就岁月尽好的躺在那，但是如果我想来点动静：比如添加一个计数器——一个数字和一个按钮，每次点击就 +1 ，这个时候我们就需要组件自己的状态了：用 `useState` 创建状态。先看一个例子：

```jsx
function App() {
  const [count, setCount] = useState(0);
  const add = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <div>count:{count}</div>
      <button onClick={add}>+1</button>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
```

我们来具体聊一下上述代码中我们到底做了哪些事情：

1. 首先，我们调用 `useState` 函数并传入初始值 `0`，`useState` 函数返回一个包含 **状态（state）** 和 **改变状态的方法（setState）** 的元组，最后我们对元组用解构赋值：将状态赋值给 `count` 常量，改变状态的方法赋值给 `setCount` 常量。
2. 然后我们定义 `add` 函数：调用 `setCount` 方法并传入 `count + 1` 的值。
3. 接着我们在 `return` 的 `div` 元素内渲染 `count`，同时将函数 `add` 绑定在 `button` 元素的 `onClick` 事件上。

运行这段代码：初次渲染 `count` 的值为 `0`，每次点击 +1 按钮后，页面中 `count` 的值 +1。

那么问题来了，页面中渲染的 `count` 是怎么改变的呢？我们来详细解析一下：

1. 第一次渲染：
   1. 初始化 `useState` 中的 `state` 为初始值 `0`，然后将其解构赋值给 `count`。
   2. 渲染 `count` 的值 `0` 到页面中。
2. 点击 +1 按钮：
   1. 调用 `add` 方法，从而调用 `setCount` 方法并传入新的状态 `count + 1` 即 `1`。
   2. 将新的状态 `1` 更新给 `useState` 中的 `state`，随后**触发重新渲染**。
3. 第二次渲染：
   1. 从 `useState` 获取中的 `state`（此时 `state` 已更新为 `1`），将其解构赋值给 `count`。
   2. 渲染 `count` 的值 `1` 到页面中。

> 根据上述分析我们可以得出 `useState` 中的 `setState` 有两个作用：
>
> 1. 更新内部 `state`；
> 2. 触发重新渲染。

可以看到，我们渲染的 UI 随着 `state` 的变化而变化，所以我们需要更新一下我们的核心公式为 `UI = f(state)`。

同时我们可以看到，在每次点击 +1 按钮后，执行相同的 `App` 函数会得到不同的结果（count 渲染的值每次都变动了），这是因为通过 `useState` 访问的 `state` 其实存储在函数组件外部的 `React Fiber` 对象上的，此时组件已经不是纯函数组件了，而是**带有副作用的函数组件**。

# 3. 参数 Props

既然函数式组件本质为函数，那么我们理应可以给它传入参数，一般将其称为 `props` 即外部参数。`props` 常常用于父子组件之间状态的传递，先看一个例子：

```jsx
function Child(props) {
  return <div>child:{props.value}</div>;
}

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Child value={count} />
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
```

上述代码中：我们先是定义一个函数子组件 `Child`，声明参数 `props`，然后在返回的 HTML 中渲染 `props.value`。在父函数组件 `App` 中，我们调用 `Child` 组件，并将 `count` 的值传给 `value`，写法为：`<Child value={count} />`。
可以看到：在父函数传入的 `value` 属性，它会挂载在一个对象上（`props`），在子函数中我们通过 `props.value` 拿到。

当我们点击 +1 按钮时，`count` 的值发生改变并触发重新渲染，`<Child value={count} />`也随之重新渲染， `props.value` 也随 `count` 的改变而改变。

至此我可以得知：`props` 的改变也会间接导致函数组件重新渲染，核心公式更改为： `UI = f(state,props)`。

# 4. 上下文 useContext

通过 `useState` 我们可以使函数式组件拥有自己的内部状态，通过 `props` 我们可以使得状态在父子组件之间传递。对于组件树中相对位置较远的组件亦或兄弟组件之间，我们可以使用 `context` 去共享状态，先看一个例子：

```jsx
// 创建 Context
const countContext = createContext(0);
// 子组件 A
function ChildA() {
  const count = useContext(countContext);
  return <div>child A:{count}</div>;
}
// 子组件 B
function ChildB() {
  const count = useContext(countContext);
  return <div>child B:{count}</div>;
}
// 父组件
function App() {
  const [count, setCount] = useState(0);
  const add = () => {
    setCount(count + 1);
  };
  return (
    <countContext.Provider value={count}>
      <ChildA />
      <ChildB />
      <button onClick={add}>+1</button>
    </countContext.Provider>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
```

1. 首先，调用 `createContext` 创建一个 `countContext` 上下文。
2. 在父组件 `App` 中，我们使用 `<countContext.Provider value={count}>` ，将 `count` 作为 `context` 的内容，然后通过 `Provider` 对包裹在其内部的组件**提供 `context`**。
3. 在子组件 `ChildA`、`ChildB` 中我们使用 `useContext(countContext)` 去**消费 `context`**，此时子组件 `count` 就是通过 `context` 共享的父组件的 `count`。

当我们点击 +1 按钮时，`App` 中 `count` 的值发生改变，`countContext` 值随之改变，并触发重新渲染，`ChildA`、`ChildB` 中 `count` 的值随着 `countContext` 改变而改变。

至此我可以得知：`context` 的改变也会间接导致函数组件重新渲染，核心公式更改为： `UI = f(state,props,context)`。

核心公式中 `state`、`props`、`context` 的变动都会更新视图 UI，但其实仔细思考一下就能发现：`props` 和 `context` 只不过是充当了 `state` 的媒介（帮助 `state` 在组件之间传递和共享），真正意义上 UI 更新还是由 `state` 的变动引起的。更为切确的说是： **`setState` 在变更 `state` 的同时触发了重新渲染 `re-render`（重新执行函数组件）进而导致 UI 视图的变更**。这一点对于理解 Hooks 的作用机制来说非常重要。

# 5. 引用 useRef

`useRef(initialValue)`

`useRef` 返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 `ref` 对象在组件的整个生命周期内保持不变。

`useRef` 和 `useState` 都可以在函数组件内部存储值（状态），相较于 `useState` , `useRef` 可以在函数组件内部更新值而不触发重新渲染。或者你可以简单的将 `useRef` 理解为变更不触发重新渲染的 `useState`。我们来看一个例子：

```js
function App() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  return (
    <div>
      <div>countRef:{countRef.current}</div>
      <div>countState:{count}</div>
      <button onClick={() => countRef.current++}>change count ref</button>
      <button onClick={() => setCount(count + 1)}>change count state</button>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
```

上述例子中：

- 当点击 `change count ref` 按钮时，页面上没有任何变化；
- 当点击 `change count state` 按钮时，页面上 `countState` 的值 +1 ，并且 `countRef` 的值也发生了变动。

值得注意的是：在 `countState` 变动并且重新渲染的同时，也会把 `countRef` 当前的值渲染出来。（这里再次解释一下：所谓重新渲染就是再次执行一遍函数（例子中`App`），在本例中会重新读取 `countRef.current` 的值然后渲染再页面中。）

# 6. 副作用 useEffect

`useEffect` 可以让你在函数组件中执行副作用操作。

## useEffect 执行顺序

`useEffect(effect, deps)`

`useEffect` 的第一个参数为一个函数（我们暂时称其为 `effect` 函数），`effect` 函数会在函数组件 `App` 每次渲染后异步执行，同时 `effect` 函数可以再返回一个函数（我们一般叫它 `cleanup` 函数），其将在下一次 `effect` 函数执行前执行。`cleanup` 函数一般用于清除 `effect` 残留的副作用，。

`useEffect` 的执行顺序可以参考下面这个例子：

```js
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('effect 执行了');
    return () => {
      console.log('cleanup 执行了');
    };
  });
  const add = () => {
    console.log('点击按钮');
    setCount(count + 1);
  };
  console.log(`App函数组件 执行了`);
  return (
    <div>
      <div>count:{count}</div>
      <button onClick={add}>+1</button>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
```

控制台打印如下：
[![HgL5Ed.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a131e00a1b5a47528deabace98200739~tplv-k3u1fbpfcp-zoom-1.image)](https://imgtu.com/i/HgL5Ed)
根据打印信息可以得到：

- 第一次渲染时，执行了 `effect` 函数；
- 当点击按钮后，触发第二次渲染，先执行 `cleanup` 函数（第一次渲染 `effect` 函数返回的函数），再执行 `effect` 函数。

## useEffect 依赖数组

`useEffect` 的第二个参数是个依赖数组（`deps`），在每次渲染后 React 会根据依赖数组来判断是否应该执行 `effect` 函数。依赖数组 `deps` 分为一下三种情况讨论：

- `deps` 为空（不填），每次函数组件渲染都会执行 `effect` 函数；
- `deps` 为 `[]`，只有在首次函数组件渲染才会执行 `effect` 函数；
- `deps` 为 `[dep1,dep2,...]`，在首次函数组件渲染，或者任意依赖项（`dep1,dep2,...`）变动的情况下会执行 `effect` 函数。

# 7. 缓存 useMemo useCallback

`useMemo` 和 `useCallback` 用于 React 的性能优化，通过合理的使用可以避免多余的计算和渲染。

## useMemo

`useMemo(fn, deps)`

`useMemo` 的参数分别是一个创建函数 `fn` 和一个依赖数组 `deps`，创建函数需要一个返回值，只有在依赖项发生改变的时候，才会重新调用此函数返回一个新的值。

如果使用过 Vue 的小伙伴肯定知道计算属性 `computed`，`useMemo` 的作用与其类似，主要用于缓存需要计算的值（`state` 的衍生值）。举一个例子：

```js
function App() {
  const [list, setList] = useState([1, 1, 1]);
  const sum = useMemo(() => {
    return list.reduce((pre, cur) => pre + cur);
  }, [list]);
  return (
    <div>
      <div>{list.map((item) => item)}</div>
      <div>sum:{sum}</div>
      <button onClick={() => setList([...list, 1])}>push</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

`sum` 依赖于 `list` 计算 `list` 的和（是状态 `list` 的衍生值），每次当且仅当 `list` 变动时，会重新调用 `useMemo` 的创建函数，返回一个新的 `sum`。

当每次点击 `push` 时，会调用 `setList` 导致 `list` 发生变化，`list` 的变化导致 `sum` 重新计算，所以可以看到 `sum` 的值随着 `list` 同步变化。

## useCallback

`useCallback(fn, deps)`

`useCallback` 的参数分别是一个创建函数 `fn` 和一个依赖数组 `deps`，返回值是创建函数的引用，只有当依赖项变化发生改变的时候，`useCallback` 才会重新创建函数并返回一个新的引用。

> `useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`

`useCallback` 最主要的作用就是用于缓存函数的引用，从而避免函数创建时，引用变化所带来的非必要渲染。

千万不要滥用 `useCallback`，一般来说 `useCallback` 的应用场景主要有二：

1. 函数组件内部定义的函数需要作为其他 Hooks 的依赖。
2. 父组件内部定义的函数需要传递给子组件，并且子组件由`React.memo`包裹。

> `React.memo` 会检查 `props` 变更，如果 `props` 未变动，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

场景 1 应该很容易理解，我们主要解释一下场景 2，例子如下：

```js
const Child = React.memo(({ onClick }) => {
  console.log(`Button render`);
  return (
    <div>
      <button onClick={onClick}>child button</button>
    </div>
  );
});

function App() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  // 情况1：未包裹 useCallback
  const onClick = () => {
    setCountA(countA + 1);
  };
  // 情况2：包裹 useCallback
  const onClick = useCallback(() => {
    setCountA(countA + 1);
  }, []);
  return (
    <div>
      <div>countA:{countA}</div>
      <div>countB:{countB}</div>
      <Child onClick={onClick1} />
      <button onClick={() => setCountB(countB + 1)}>App button</button>
    </div>
  );
}
```

上例中，`Child` 子组件由 `React.memo` 包裹，接收 `onClick` 函数作为参数。

- 情况 1：`onClick` 未包裹 `useCallback` ，当点击 `app button` 时，触发重新渲染，`onClick` 重新生成函数引用，导致 `Child` 子组件重新渲染。
- 情况 2：`onClick` 包裹 `useCallback` ，当点击 `app button` 时，触发重新渲染，`onClick` 不会生成新的引用，避免了 `Child` 子组件重新渲染。

# 参考文档

- [React 官方文档](https://zh-hans.reactjs.org/docs/getting-started.html)
