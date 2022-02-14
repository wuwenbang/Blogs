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

即视图等于一个函数执行的结果，在这个公式中 `f` 为一个纯函数组件。

> 纯函数：相同的输入，总是会的到相同的输出，并且在执行过程中没有任何副作用。

# 2. 内部状态 useState

现在我们已经可以通过 React 渲染一个页面了，然而他就岁月尽好的躺在那，但是如果我想来点动静：比如添加一个计数器——一个数字和一个按钮，每次点击就 +1 ，这个时候我们就需要组件内部的状态了：用`useState` 创建内部状态。先看一个例子：

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

1. 首先，我们调用 `useState` 函数并传入初始值 `0`，`useState` 函数返回一个包含**状态（state）**和**改变状态的方法（setState）**的元组，最后我们对元组用解构赋值：将状态赋值给 `count` 常量，改变状态的方法赋值给 `setCount` 常量。
2. 然后我们定义 `add` 函数：调用 `setCount` 方法并传入 `count + 1` 的值。
3. 接着我们在 `return` 的 `div` 元素内渲染 `count`，同时将函数 `add` 绑定在 `button` 元素的 `onClick` 事件上。

运行这段代码：初次渲染 `count` 的值为 `0`，每次点击 +1 按钮后，页面中 `count` 的值 +1。

那么问题来了，页面中渲染的 `count` 是怎么改变的呢？我们来详细解析一下：

1. 第一次渲染：
   1. 初始化 `useState` 内部的 `state` 为初始值 `0`，然后将其解构赋值给 `count`。
   2. 渲染 `count` 的值 `0` 到页面中。
2. 点击 +1 按钮：
   1. 调用 `add` 方法，从而调用 `setCount` 方法并传入新的状态 `count + 1` 即 `1`。
   2. 将新的状态 `1` 更新给 `useState` 内部的 `state`，随后**触发重新渲染**。
3. 第二次渲染：
   1. 从 `useState` 获取内部的 `state`（此时 `state` 已更新为 `1`），将其解构赋值给 `count`。
   2. 渲染 `count` 的值 `1` 到页面中。

> 根据上述分析我们可以得出 `useState` 中的 `setState` 有两个作用：
>
> 1. 更新内部 `state`；
> 2. 触发重新渲染。

可以看到，我们渲染的 UI 随着 `state` 的变化而变化，所以我们需要更新一下我们的核心公式为 `UI = f(state)`。

# 3. 外部参数 Props

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

# 5. 引用 useRef

# 6. 副作用 useEffect

# 7. 缓存 useMemo useCallback
