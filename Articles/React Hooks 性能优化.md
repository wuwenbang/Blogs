# 前言

现在越来越多人开始使用 React Hooks + 函数组件的方式构筑页面。函数组件简洁且优雅，通过 Hooks 可以让函数组件拥有内部的状态和副作用（生命周期），弥补了函数组件的不足。

但同时函数组件的使用也带来了一些额外的问题：由于函数式组件内部的状态更新时，会重新执行一遍函数，那么就有可能造成以下两点性能问题：

1. 造成子组件的非必要重新渲染
2. 造成组件内部某些代码（计算）的重复执行

好在 React 团队也意识到函数组件可能发生的性能问题，并提供了 `React.memo`、`useMemo`、`useCallback` 这些 API 帮助开发者去优化他们的 React 代码。在使用它们进行优化之前，我想我们需要明确我们使用它们的目的：

1. 减少组件的**非必要重新渲染**
2. 减少组件**内部的重复计算**

# 1 使用 React.memo 避免组件的重复渲染

在讲述 `React.memo` 的作用之前，我们先来思考一个问题：什么情况下需要重新渲染组件？

一般来讲以下三种情况需要重新渲染组件：

1. 组件内部 `state` 发生变化时
2. 组件内部使用的 `context` 发生变化时
3. 组件外部传递的 `props` 发生变化时

现在我们先只关注第 3 点：`props` 发生变化时重新渲染，这种情况是一种理想情况。因为如果一个父组件重新渲染，即使其子组件的 `props` 没有发生任何变化，这个子组件也会重新渲染，我们称这种渲染为**非必要的重新渲染**。这时 `React.memo` 就可以派上用场了。

首先 `React.memo` 是一个**高阶组件**。

> 高阶组件（Higher Order Component）类似一个工厂：将一个组件丢进去，然后返回一个被加工过的组件。

被 `React.memo` 包裹的组件在渲染前，会对新旧 `props` 进行**浅比较**：

- 如果新旧 `props` 浅比较相等，则不进行重新渲染（使用缓存的组件）。
- 如果新旧 `props` 浅比较不相等，则进行重新渲染（重新渲染的组件）。

上述的解释可能会比较抽象，我们来看一个具体的例子：

```tsx
import React, { useState } from 'react';

const Child = () => {
  console.log('Child 渲染了');
  return <div>Child</div>;
};

const MemoChild = React.memo(() => {
  console.log('MemoChild 渲染了');
  return <div>MemoChild</div>;
});

function App() {
  const [isUpdate, setIsUpdate] = useState(true);
  const onClick = () => {
    setIsUpdate(!isUpdate);
    console.log('点击了按钮');
  };
  return (
    <div className="App">
      <Child />
      <MemoChild />
      <button onClick={onClick}>刷新 App </button>
    </div>
  );
}

export default App;
```

上例中：`Child` 是一个普通的组件，`MemoChild` 是一个被 `React.memo` 包裹的组件。

当我点击 `button` 按钮时，调用 `setIsUpdate` 触发 App 组件重新渲染（re-render）。

控制台结果如下：

[![qpeoct.png](https://s1.ax1x.com/2022/03/16/qpeoct.png)](https://imgtu.com/i/qpeoct)

如上图：
首次渲染时，`Child` 和 `MemoChild` 都会被渲染，控制台打印 `Child 渲染了` 和 `memoChild` 渲染了。

而当我点击按钮触发重新渲染后，`Child` 依旧会重新渲染，而 `MemoChild` 则会进行新旧 `props` 的判断，由于 `memoChild` 没有 `props`，即新旧 `props` 相等（都为空），则 `memoChild` 使用之前的渲染结果（缓存），避免了重新渲染。

由此可见，在没有任何优化的情况下，React 中某一组件重新渲染，会导致其**全部的子组件重新渲染**。即通过 `React.memo` 的包裹，在其父组件重新渲染时，可以避免这个组件的非必要重新渲染。

需要注意的是：上文中的【渲染】指的是 React 执行函数组件并生成或更新虚拟 DOM 树（Fiber 树）的过程。在渲染真实 DOM （Commit 阶段）前还有 DOM Diff 的过程，会比对虚拟 DOM 之间的差异，再去渲染变化的 DOM 。不然如果每次更改状态都会重新渲染真实 DOM，那么 React 的性能真就爆炸了（笑）。

# 2 使用 useMemo 避免重复计算

`const memolized = useMemo(fn,deps)`

React 的 useMemo 把【计算函数 `fn`】和【依赖项数组 `deps`】作为参数，useMemo 会执行 `fn` 并返回一个【缓存值 `memolized`】，它仅会在某个依赖项改变时才重新计算 `memolized`。这种优化有助于避免在每次渲染时都进行高开销的计算。具体使用场景可以参考下例：

```tsx
import React, { useMemo, useState } from 'react';

function App() {
  const [list] = useState([1, 2, 3, 4]);
  const [isUpdate, setIsUpdate] = useState(true);
  const onClick = () => {
    setIsUpdate(!isUpdate);
    console.log('点击了按钮');
  };

  // 普通计算 list 的和
  console.log('普通计算');
  const sum = list.reduce((previous, current) => previous + current);

  // 缓存计算 list 的和
  const memoSum = useMemo(() => {
    console.log('useMemo 计算');
    return list.reduce((previous, current) => previous + current);
  }, [list]);

  return (
    <div className="App">
      <div> sum:{sum}</div>
      <div> memoSum:{memoSum}</div>
      <button onClick={onClick}>重新渲染 App</button>
    </div>
  );
}

export default App;
```

上例中：`sum` 是一个根据 `list` 得到的普通计算值，`memoSum` 是一个通过 `useMemo` 得到的 momelized 值（缓存值），并且依赖项为 `list`。

[![qpR3CT.png](https://s1.ax1x.com/2022/03/16/qpR3CT.png)](https://imgtu.com/i/qpR3CT)

如上图控制台中 log 所示：

1. 首次渲染，`sum` 和 `memoSum` 都会根据 `list` 的值进行计算；

2. 当点击 【重新渲染 App】按钮后，虽然 `list` 没有改变，但是 `sum` 的值进行了重新计算，而 `memoSum` 的值则没有重新计算，使用了上一次的计算结果（memolized）。

3. 当点击 【往 List 添加一个数字】按钮后，`list` 的值发生改变，`sum` 和 `memoSum` 的值都进行重新计算。

总结：在函数组件内部，一些**基于 State 的衍生值和一些复杂的计算**可以通过 `useMemo` 进行性能优化。

# 3 使用 useCallback 避免子组件的重复渲染

`const memolizedCallback = useCallback(fn, deps);`

React 的 useCallback 把【回调函数 `fn`】和【依赖项数组 `deps`】作为参数，并返回一个【缓存的回调函数 `memolizedCallback`】（本质上是一个引用），它仅会在某个依赖项改变时才重新生成 `memolizedCallback`。当你把 `memolizedCallback` 作为参数传递给子组件（被 React.memo 包裹过的）时，它可以避免非必要的子组件重新渲染。

## useCallback 与 useMemo 异同

`useCallback` 与 `useMemo` 都会缓存对应的值，并且只有在依赖变动的时候才会更新缓存，区别在于：

- `useMemo` 会执行传入的回调函数，返回的是**函数执行的结果**
- `useCallback` 不会执行传入的回调函数，返回的是**函数的引用**

## useCallback 使用误区

有很多初学者（包括以前的我）会有这样一个误区：在函数组件内部声明的函数全部都用 `useCallback` 包裹一层，以为这样可以通过避免函数的重复生成优化性能，实则不然：

1. 首先，在 JS 内部函数创建是非常快的，这点性能问题不是个问题（参考：[React 官方文档：Hook 会因为在渲染时创建函数而变慢吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#are-hooks-slow-because-of-creating-functions-in-render)）
2. 其次，使用 `useCallback` 会造成额外的性能损耗，因为增加了额外的 `deps` 变化判断。
3. 每个函数用 `useCallback` 包一层，不仅显得臃肿，而且还需要手写 `deps` 数组，额外增加心智负担。

## useCallback 正确的使用场景

1. 函数组件内部定义的函数需要**作为其他 Hooks 的依赖**。
2. 函数组件内部定义的函数需要传递给其子组件，并且**子组件由 `React.memo` 包裹**。

场景 1：`useCallback` 主要是为了避免当组件重新渲染时，函数引用变动所导致其它 Hooks 的重新执行，更为甚者可能造成组件的无限渲染：

```tsx
import React, { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(1);
  const add = () => {
    setCount((count) => count + 1);
  };
  useEffect(() => {
    add();
  }, [add]);
  return <div className="App">count: {count}</div>;
}

export default App;
```

上例中，`useEffect` 会执行 `add` 函数从而触发组件的重新渲染，函数的重新渲染会重新生成 `add` 的引用，从而触发 `useEffect` 的重新执行，然后再执行 `add` 函数触发组件的重新渲染... ，从而导致无限循环：

`useEffect` 执行 -> `add` 执行 -> `setCount` 执行 -> `App` 重新渲染 -> `add` 重新生成 -> `useEffect` 执行 -> `add` 执行 -> ...

为了避免上述的情况，我们给 `add` 函数套一层 `useCallback` 避免函数引用的变动，就可以解决无限循环的问题：

```tsx
import React, { useCallback, useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(1);
  // 用 useCallback 包裹 add ，只会在组件第一次渲染生成函数引用，之后组件重新渲染时，add 会复用第一次生成的引用。
  const add = useCallback(() => {
    setCount((count) => count + 1);
  }, []);
  useEffect(() => {
    add();
  }, [add]);
  return <div className="App">count: {count}</div>;
}

export default App;
```

场景 2：`useCallback` 是为了避免由于回调函数引用变动，所导致的子组件非必要重新渲染。（这个子组件有两个前提：首先是接收回调函数作为 `props`，其次是被 `React.memo` 所包裹。）

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

上例中，`Child` 子组件由 `React.memo` 包裹，接收 `onClick` 函数作为 `props` 参数。

- 情况 1：`onClick` 未包裹 `useCallback` ，当点击 `app button` 时，触发重新渲染，`onClick` **重新生成函数引用**，导致 `Child` 子组件重新渲染。
- 情况 2：`onClick` 包裹 `useCallback` ，当点击 `app button` 时，触发重新渲染，`onClick` **不会生成新的引用**，避免了 `Child` 子组件重新渲染。

# 4 总结

上文叙述中，我们通过 `React.memo`、`useMemo`、`useCallback` 这些 API 避免了在使用函数组件的过程中可能触发的性能问题，总结为一下三点：

- 通过 `React.memo` 包裹组件，可以避免组件的非必要重新渲染。
- 通过 `useMemo`，可以避免组件更新时所引发的重复计算。
- 通过 `useCallback`，可以避免由于函数引用变动所导致的组件重复渲染。

# 参考文章

- [React 官方文档](https://zh-hans.reactjs.org/docs/hooks-faq.html#performance-optimizations)
- [Segmentfault 一直以来 useCallback 的使用姿势都不对](https://segmentfault.com/a/1190000022988054)
