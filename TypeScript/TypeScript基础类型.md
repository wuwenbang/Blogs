### 1. Number 类型

```ts
let count: number = 10
// ES5：var count = 10;
```

### 2. String 类型

```ts
let name: string = 'hello world'
// ES5：var name = 'hello world';
```

### 3. Boolean 类型

```ts
let isCheck: boolean = false
// ES5：var isCheck = false;
```

### 4. Symbol 类型

```ts
const sym = Symbol()
let obj = {
  [sym]: 'hello world',
}

console.log(obj[sym]) // hello world
```

### 5. Null 和 Undefined 类型

TypeScript 里，`undefined` 和 `null` 两者有各自的类型分别为 `undefined` 和 `null`。

```ts
let u: undefined = undefined
let n: null = null
```

### 6. Array 类型

TypeScript 里，数组类型有两种表达形式：

1. 直接表示：`type[]`。
2. 用泛型的方式表示：`Array<type>`。

```ts
let array: number[] = [1, 2, 3]
// ES5：var array = [1,2,3];

let array: Array<number> = [1, 2, 3] // Array<number>泛型语法
// ES5：var array = [1,2,3];
```

### 7. Tuple（元组） 类型

`数组（Array）`合并了相同类型的值，而`元组（Tuple）`合并了不同类型的值

```ts
let array: number[] = [100, 200]
let tuple: [number, string] = [100, '200']
```

当赋值或访问一个已知索引的元素时，会得到正确的类型：

```ts
let tuple: [string, number]
tuple[0] = 'Jack'
tuple[1] = 22

tuple[0].substr(1) //String独有方法
tuple[1].toFixed(2) //Number独有方法
```

`元组（Tuple）`类型是固定长度，固定类型的

```ts
let tuple: [string, number]
tuple = ['jack'] //❌
tuple = [100, 'juck'] //❌
tuple = ['juck', 100] //✅
```

`React`中的`useState`返回的就是元组类型：

```ts
// 类型定义：返回元组类型 [S, Dispatch<SetStateAction<S>>]
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]
// 元组：解构赋值
const [state, setState] = useState(0)
```

总结：`数组（Array）`和`元组（Tuple）`的差异：

1. `Array`类型统一，`Tuple`类型可以不一。
2. `Array`长度不限，`Tuple`长度限定。

### 8. Enum（枚举）类型

使用枚举我们可以定义一些带名字的常量，以表达限定在一定范围内值。 TypeScript 支持数字的和基于字符串的枚举。

#### 1. 数字枚举

```ts
enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

let dir: Direction = Direction.NORTH //let dir = 0
```

默认情况下，`NORTH` 的初始值为 `0`，其余的成员会自动`+1`增长。换句话说，`Direction.SOUTH`值为`1`，`Direction.EAST`值为`2`，`Direction.WEST`值为`3`。

当然我们也可以设置 NORTH 的初始值，比如：

```ts
enum Direction {
  NORTH = 3,
  SOUTH, //4
  EAST, //5
  WEST, //6
}
```

#### 2. 字符串枚举

在 TypeScript 2.4 版本，允许我们使用字符串枚举。在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

```ts
enum Direction {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
}
let dir: Direction = Direction.NORTH //let dir = 'NORTH'
```

比起`枚举`类型，我更推荐使用`联合类型`来表达对于一组值的约束：

```ts
const Direction = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST'
let dir: Direction = 'NORTH'
```

### 9. Object 类型

`Object 类型`：它是所有 `Object` 类的实例的类型，它由以下两个接口来定义：

1. `Object` 接口定义了 `Object.prototype` 原型对象上的属性；

```ts
// node_modules/typescript/lib/lib.es5.d.ts
interface Object {
  constructor: Function
  toString(): string
  toLocaleString(): string
  valueOf(): Object
  hasOwnProperty(v: PropertyKey): boolean
  isPrototypeOf(v: Object): boolean
  propertyIsEnumerable(v: PropertyKey): boolean
}
```

2. `ObjectConstructor` 接口定义了 `Object` 类的属性。

```ts
// node_modules/typescript/lib/lib.es5.d.ts
interface ObjectConstructor {
  /** Invocation via `new` */
  new (value?: any): Object
  /** Invocation via function calls */
  (value?: any): any
  readonly prototype: Object
  getPrototypeOf(o: any): any
  // ···
}
```

`Object` 类的所有实例都继承了 `Object` 接口中的所有属性。

### 10. Any 类型

在 `TypeScript` 中，任何类型都可以被归为 `any` 类型。这让 `any` 类型成为了类型系统的顶级类型（也被称作全局超级类型）。

```ts
let value: any = 666
value = 'hello'
value = false
value = {}
value = []
```

`any`类型为从`JavaScript`到`TypeScript`提供了平稳的过渡方式：你可以将任意类型赋值给`any`类型，同时也可以对 `any` 类型的值执行任何操作，而无需做任何形式的静态类型检查。

```ts
let value: any

value.foo.bar //✅
value.trim() // ✅
value() // ✅
new value() // ✅
value[0][1] // ✅
```

在许多场景下，这太宽松了。使用 `any` 类型，可以很容易地编写类型正确但在运行时有问题的代码。如果我们使用 `any` 类型，就无法使用 `TypeScript` 提供的大量的保护机制。为了解决 `any` 带来的问题，`TypeScript 3.0` 引入了 `unknown` 类型。

### 11. Unknown 类型

就像所有类型都可以赋值给 `any`，所有类型也都可以赋值给 `unknown`。

```ts
let value: unknown = 666
value = 'hello'
value = false
value = {}
value = []
```

但是你不能将`unknown`类型赋值给一个已经确定的类型：即`unknown` 类型只能被赋值给 `any` 类型和 `unknown` 类型本身。

```ts
let value: unknown

let value1: unknown = value // ✅
let value2: any = value // ✅
let value3: boolean = value // ❌
let value4: number = value // ❌
let value5: string = value // ❌
let value6: object = value // ❌
let value7: any[] = value // ❌
let value8: Function = value // ❌
```

同时`unknown`也无法像`any`那样执行任意操作：

```ts
let value: unknown

value.foo.bar // ❌
value.trim() // ❌
value() // ❌
new value() // ❌
value[0][1] // ❌
```

总结：`any`类型和`unknown`类型的异同：

| 类型   | any                | unknown                                |
| ------ | ------------------ | -------------------------------------- |
| 被赋值 | 可以被赋予任意值   | 可以被赋予任意值                       |
| 赋值   | 可以赋值给任意变量 | 只能赋值给 `any` 和 `unknown` 类型变量 |
| 操作   | 可以进行任意操作   | 所有操作被禁止                         |

### 12. Void 类型

某种程度上来说，`void` 类型像是与 `any` 类型相反，它表示没有任何类型。当一个函数没有返回值时，你通常会见到其返回值类型是 `void`：

```ts
function doSomething(): void {
  console.log('do something')
}
```

需要注意的是，声明一个 `void` 类型的变量没有什么作用，因为在严格模式下，它的值只能为 `undefined：`

```ts
let unusable: void = undefined
```

### 13. Never 类型

`never` 类型表示的是那些永不存在的值的类型。
例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。

```ts
// function 永远不会返回
function error(message: string): never {
  throw new Error(message)
}
```

又如，基础类型的`交叉类型`返回的也是`never`，应为他们之间永远不存在交集：

```ts
let value = '1' & 1 // never
```

在 `TypeScript` 中，可以利用 `never` 类型的特性来实现全面性检查，具体示例如下：

```ts
type Foo = string | number

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === 'string') {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === 'number') {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo
  }
}
```

注意在 `else` 分支里面，我们把收窄为 `never` 的 `foo` 赋值给一个显示声明的 `never` 变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天你的同事修改了 `Foo` 的类型：

```ts
type Foo = string | number | boolean
```

然而他忘记同时修改 `controlFlowAnalysisWithNever` 方法中的控制流程，这时候 `else` 分支的 `foo` 类型会被收窄为 `boolean` 类型，导致无法赋值给 `never` 类型，这时就会产生一个编译错误。通过这个方式，我们可以确保
`controlFlowAnalysisWithNever` 方法总是穷尽了 `Foo` 的所有可能类型。
通过这个示例，我们可以得出一个结论：使用 `never` 避免出现新增了`联合类型`没有对应的实现，目的就是写出类型绝对安全的代码。

### 参考文献

[TypeScript 中文手册](https://typescript.bootcss.com/basic-types.html)

[一份不可多得的 TS 学习指南](https://juejin.cn/post/6872111128135073806#heading-28)
