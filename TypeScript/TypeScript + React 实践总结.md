本文根据日常的开发实践，参考优秀的文档、文章，总结出一些`TypeScript`在`React`开发中实用的技巧和经验。
由于日常开发中已全面拥抱函数式组件和 `React Hooks`，所以 `class` 类组件的写法这里不提及。

# 构建项目

markdown

构筑一个`React with TypeScript`项目最快的方式就是使用 Facebook 官方脚手架`create-react-app`提供的`TypeScript`模版。运行以下指令：

```bash
$ create-react-app my-app --template typescript
```

生成后的项目文件会多有些许不同，主要新增了以下配置：

- `.tsx`：使用 `TypeScript` 的 `JSX` 文件扩展；
- `tsconfig.json`：默认的 `TypeScript` 的配置文件；
- `react-app-env.d.ts`：`TypeScript` 声明文件， 注释的内容会作为编译器指令使用。

# 函数式组件

### 普通声明

```tsx
interface PropsType {
  value: string
  children: React.ReactNode // 显示声明
}
const MyComponent = ({ title, children }: PropsType) => {
  return <div title={title}>{children}</div>
}
```

### 使用 React.FC 声明

`PropsType`作为`React.FC`的范型参数（推荐方式）

```tsx
interface PropsType {
  title: string
}
const MyComponent: React.FC<PropsType> = ({ title, children }) => {
  return <div title={title}>{children}</div>
}
```

使用 `React.FC` 声明函数组件与 `普通声明` 的区别是：

- `React.FC` 是隐式声明 `children`（目前存在一些[issue](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33006)） ，而 `普通声明` 则是显示的声明 `children` 。
- `React.FC` 显式地定义了返回类型，`普通声明`则是隐式推导的。
- `React.FC` 对静态属性：`displayName`、`propTypes`、`defaultProps`提供了类型检查和自动补全。

# Props

### 常用的基础 Props 类型

```ts
interface PropsType = {

  // 基本类型
  message: string;
  count: number;
  disabled: boolean;

  // 数组
  names: string[];

  // 联合类型
  status: 'waiting' | 'success';

  // 对象
  obj: {
    id: string;
    title: string;
  };

  // 对象数组
  objArr: {
    id: string;
    title: string;
  }[];

  // Map类型
  map1: {
    [key: number]: string;
  };

  // Map类型的另一种实现方式
  map2: Record<number, string>;

  // 没有参数&返回值的函数
  onClick: () => void;

  // 携带参数的函数
  onChange: (id: number) => void;

  // 携带点击事件的函数
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;

  // 可选的属性
  optional?: OptionalType;

};
```

### 常用的 React Props 类型

```ts
export declare interface AppBetterProps {
  children: React.ReactNode // 一般情况下推荐使用，支持所有类型

  functionChildren: (name: string) => React.ReactNode // 函数组件

  style?: React.CSSProperties // 传递style对象

  onChange?: React.FormEventHandler<HTMLInputElement> //表单事件, 泛型参数是event.target的类型
}
```

### 设置 Props 的默认值

- 传递`Props`时，设置默认值（推荐方式）

```tsx
interface PropsType {
  text: string
}

// 传递 props 时，设置默认值
const MyComponent: React.FC<PropsType> = ({ text = 'default' }) => {
  return <div>{text}</div>
}
```

- 通过`defaultProps`设置默认值

```tsx
interface PropsType {
  text: string
}

const MyComponent: React.FC<PropsType> = ({ text }) => {
  return <div>{text}</div>
}

// 通过 defaultProps 设置默认值
MyComponent.defaultProps = {
  text: 'default',
}
```

# React Hooks

### useState

- 给定初始值的情况下，TypeScript 会做类型推断

```ts
const [state, setState] = useState(false)
// state 会被自动推断为 boolean 类型
```

- 没有初始值或初始值为`null`时，可以使用联合类型

```ts
interface DataType {
  message: string
}

const [data, setData] = <DataType | null>useState(null)
// or
const [data, setData] = <DataType | undefined>useState()
```

### useEffect

- 首先看一下 `useEffect` 接收`第一个参数`的类型定义

```ts
// 1. 是一个函数
// 2. 无参数
// 3. 无返回值 或 返回一个清理函数，该函数类型无参数、无返回值 。
type EffectCallback = () => void | (() => void | undefined)
```

- 根据定义，`useEffect`的使用方式为

```ts
useEffect(() => {
  // when deps update

  // 可选
  return () => {
    // when component unmount
  }
}, [deps])
// ✅ 确保函数返回 void 或 一个返回 void|undefined 的清理函数
```

- 同理，用 `async await` 语法处理异步请求，类似传入一个 `() => Promise<void>` 函数，与 `EffectCallback` 类型不匹配。

```ts
// ❌ error
useEffect(async () => {
  const { data } = await ajax(params)
  // todo
}, [params])
```

- 异步请求的处理方式：

```ts
// ✅ 立即执行函数
useEffect(() => {
  ;(async () => {
    const { data } = await ajax(params)
    // todo
  })()
}, [params])

// ✅ 或者 then 也是可以的
useEffect(() => {
  ajax(params).then(({ data }) => {
    // todo
  })
}, [params])
```

### useRef

`useRef` 一般用于两种场景

1. 引用 `DOM` 元素；
2. 不想作为其他 `hooks` 的依赖项，因为 `ref` 的值引用是不会变的，变的只是 `ref.current`。

- `useRef` 传递非空初始值的时候可以推断类型，
- 也可以通过传入第一个泛型参数来定义类型，约束 `ref.current` 的类型。

```ts
// 引用DOM
const domRef = React.useRef<HTMLDivElement | null>(null)
// 非依赖项值
const countRef = React.useRef<number>(0)
```

### useReducer

使用 `useReducer` 时，多多利用 `联合类型` 来精确辨识、收窄确定的 `type` 的 `payload` 类型。 一般也需要定义 `reducer` 的返回类型，不然 TS 会自动推导。

```tsx
// 使用联合类型约束 Action 的 type 和 payload
type ACTIONTYPE = { type: 'increment'; payload: number } | { type: 'decrement'; payload: string } | { type: 'initial' }

// reducer
function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.payload }
    case 'decrement':
      return { count: state.count - Number(action.payload) }
    case 'initial':
      return { count: initialState.count }
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement', payload: '5' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment', payload: 5 })}>+</button>
    </>
  )
}
```

### useContext

- 通过`React.createContext<Type>()`的范型函数定义共享状态的类型。
- 下例是 `useContext` 和 `useReducer` 结合使用，来管理全局的数据流。

```tsx
interface AppContextInterface {
  state: typeof initialState
  dispatch: React.Dispatch<ACTIONTYPE>
}
// 通过范型定义 Context 的类型
const AppCtx = React.createContext<AppContextInterface>({
  state: initialState,
  dispatch: (action) => action,
})
const App = (): React.ReactNode => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppCtx.Provider value={{ state, dispatch }}>
      <Counter />
    </AppCtx.Provider>
  )
}
// 消费 context
function Counter() {
  const { state, dispatch } = React.useContext(AppCtx)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement', payload: '5' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment', payload: 5 })}>+</button>
    </>
  )
}
```

# 事件处理

### 事件对象类型

在事件处理函数中，我们经常性的需要使用 `event` 对象，比如获取`Input`事件的`e.target.value`，鼠标事件的`clientX`、`clientY`。
在刚接触`TypeScript`开发时，我都是直接把 `event` 设置为 `any` 类型，但是这样就失去了`TypeScript`对代码进行静态检查的意义。

```ts
const onChange = (e: any) => {
  console.log(e.target.value)
}
```

幸运的是 `React` 的声明文件提供了 `Event` 对象的类型声明，拿最常见的情况之一：`Input`的`onChange`事件举例：

```tsx
import React from 'react'
const MyInput: React.FC = () => {
  const [value, setValue] = React.useState('')

  // e 的类型是 ChangeEvent
  // e.target 的类型是 HTMLInputElement
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return <input value={value} onChange={onChange} id="input-example" />
}

export default MyInput
```

### 常用 Event 事件对象类型

- `ClipboardEvent<T = Element>` 剪贴板事件对象
- `DragEvent<T = Element>` 拖拽事件对象
- `ChangeEvent<T = Element>` Change 事件对象
- `KeyboardEvent<T = Element>` 键盘事件对象
- `MouseEvent<T = Element>` 鼠标事件对象
- `TouchEvent<T = Element>` 触摸事件对象
- `WheelEvent<T = Element>` 滚轮事件对象
- `AnimationEvent<T = Element>` 动画事件对象
- `TransitionEvent<T = Element>` 过渡事件对象

### 事件处理函数类型

当我们定义事件处理函数时有没有更方便定义其函数类型的方式呢？答案是使用 `React` 声明文件所提供的 `EventHandler` 类型别名，通过不同事件的 `EventHandler` 的类型别名来定义事件处理函数的类型。

`EventHandler` 类型实现源码 `node_modules/@types/react/index.d.ts` 。

```ts
type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }['bivarianceHack']
type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>
type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>
type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>
type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>
type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>
type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>
type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>
type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>
type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>
type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>
type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>
type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>
type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>
type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>
```

实例：

```ts
interface PropsType {
  onClick: MouseEventHandler<HTMLDivElement>
  onChange: ChangeEventHandler<HTMLInputElement>
}
```

# 参考资料

- [TypeScript 中文手册 React](https://typescript.bootcss.com/tutorials/react.html)
- [React with TypeScript 最佳实践](https://juejin.cn/post/6884144754993397767#heading-8)
