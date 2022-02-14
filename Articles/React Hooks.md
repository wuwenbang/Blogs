# 1. React 核心公式

当我们在使用 React 构筑视图的时候，我们到底在干什么呢？
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
（即视图等于一个函数执行的结果。）

# 2. 内部状态 useState

现在我们已经可以通过 React 渲染一个页面了，然而他就岁月尽好的躺在那，但是如果我想来点动静：比如添加一个计数器——一个数字和一个按钮，每次点击就 +1 ，这个时候我们就需要组件内部的状态了：用 `useState` Hooks 创建函数组件的内部状态。

```js
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

根据上述代码，我们每次点击一次 +1 按钮，就会调用 `add` 函数从而调用 `setCount(count + 1)`方法，随后视图上的 `count` 数字就会 +1。

在我第一次接触这段代码的时候，我觉得这非常的神奇：函数组件 `App` 明明是一个无参函数，按理来说它执行的结果是不会发生变化的
`UI = f(state)`

# 3. 外部参数 Props

`UI = f(state,props)`

# 4. 上下文 useContext

`UI = f(state,props,context)`

# 5. 引用 useRef

# 6. 副作用 useEffect

# 7. 缓存 useMemo useCallback
