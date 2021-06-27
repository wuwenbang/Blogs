在使用`TypeScript`的时候，我们常常使用`interface`和`type`去描述复杂数据的形状和类型，比如`对象`和`函数`。由于他们的使用方式高度相似，一度让我觉得他们是可以相互替换的。但是随着更加深入的了解，我发现了他们之间的一些异同点，然我们一起来看看吧。

## 1. Inteface 接口

在面向对象语言中，`接口`是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类去实现。
`TypeScript` 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对`对象的形状（Shape）`进行描述。

### 1.1 接口的作用

1. 描述对象

```ts
interface Person {
  name: string;
  age: number;
  run: () => void;
}
let tom: Person = {
  name: "Tom",
  age: 23,
};
```

2. 描述函数

```ts
interface Action {
  (): void;
}
const sayHi: Action = () => {
  console.log("Hi!");
};
```

### 1.2 可选属性与只读属性

```ts
interface Person {
  readonly name: string; // 只读属性：只可读取，不可更改
  age?: number; // 可选属性：该对象可以拥有，也可以没有该属性
}
let tom: Person = {
  name: "Tom",
};
tom.name = "Jack"; // error 不可更改
```

### 1.3 任意属性

有时候我们希望我们定义的对象可以拥有一个任意属性，这时我们可以使用`索引签名`的形式来满足上述要求。

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

const tom = { name: "Tom" };
const jack = { name: "Jack", age: 5 };
const susan = { name: "Susan", sex: "famale" };
```

## 2. Type Alias 类型别名

### 2.1 类型别名的定义

`type（Type Alias 类型别名）`会给一个类型起个新名字。类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

```ts
// 基本类型
type Count = number;
// 函数
type Fun = () => void;
// 对象
type Person = {
  name: string;
  age: number;
};
```

## 3. Inteface 和 Type Alias 的相同点

### 3.1 都可以用来描述对象或函数

```ts
// interface
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}
```

```ts
// type alias
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

### 3.2 都可以扩展

两者都可以用来扩展，但是扩展方式不同，`接口`的扩展就是继承，通过`extends`来实现。`类型别名`的扩展就是`交叉类型`，通过`&`来实现。

```ts
// 接口扩展
interface PointX {
  x: number;
}

interface Point extends PointX {
  y: number;
}
```

```ts
// 类型别名扩展
type PointX = {
  x: number;
};

type Point = PointX & {
  y: number;
};
```

PS：接口可以扩展类型别名，同理，类型别名也可以扩展接口。

## 4. Inteface 和 Type Alias 的不同点

### 4.1 type 可以声明基本类型，而 interface 不行

- `type` 可以声明基本类型

```ts
type Count = number;
type Color = "Red" | "Blue";
```

- `interface` 只能用来声明复杂类型（对象和函数）

### 4.2 扩展时表现不同

- 扩展`接口`时，TS 将检查扩展的接口是否可以赋值给被扩展的接口。

```ts
interface A {
  good(x: number): string;
  bad(x: number): string;
}
interface B extends A {
  good(x: string | number): string;
  bad(x: number): number; // Interface 'B' incorrectly extends interface 'A'.
  // Types of property 'bad' are incompatible.
  // Type '(x: number) => number' is not assignable to type '(x: number) => string'.
  // Type 'number' is not assignable to type 'string'.
}
```

- 但使用`交叉类型`时则不会出现这种情况。我们将上述代码中的接口改写成类型别名，把 extends 换成交集运算符&，TS 将尽其所能把扩展和被扩展的类型组合在一起，而不会抛出编译时错误。

```ts
type A = {
  good(x: number): string;
  bad(x: number): string;
};
type B = A & {
  good(x: string | number): string;
  bad(x: number): number;
};
// ok
```

### 4.3 多次定义时表现不同

`接口`多次的声明会合并。`类型别名`不能重复声明。

- `接口`可以定义多次，多次的声明会合并。

```ts
interface Point {
  x: number;
}
interface Point {
  y: number;
}
const point: Point = { x: 1 }; //error Property 'y' is missing in type '{ x: number; }' but required in type 'Point'.

const point: Point = { x: 1, y: 1 }; // ok
```

- 但是`类型别名`如果定义多次，会报错。

```ts
type Point = {
  x: number; //error Duplicate identifier 'A'.
};

type Point = {
  y: number; //error Duplicate identifier 'A'.
};
```

## 到底应该用哪个？

如果`接口`和`类型别名`都能满足的情况下，到底应该用哪个是我们关心的问题。

感觉哪个都可以，但是强烈建议大家只要能用`接口`实现的就**优先使用接口**，接口满足不了的再用`类型别名`。

为什么会这么建议呢？其实在 TS 的 wiki 中有说明。具体的文章地址在这里：[TS wiki](https://github.com/microsoft/TypeScript/wiki/Performance#writing-easy-to-compile-code)
以下是`Preferring Interfaces Over Intersections`的译文：

> 大多数时候，对于声明一个对象，类型别名和接口表现的很相似。
>
> ```ts
> interface Foo {
>   prop: string;
> }
> type Bar = { prop: string };
> ```
>
> 然而，当你需要通过组合两个或者两个以上的类型实现其他类型时，可以选择使用接口来扩展类型，也可以通过交叉类型（使用&创造出来的类型）来完成，这就是二者开始有区别的时候了。
>
> - 接口会创建一个单一扁平对象类型来检测属性冲突，当有属性冲突时会提示，而交叉类型只是递归的进行属性合并，在某种情况下可能产生 never 类型
> - 接口通常表现的更好，而交叉类型做为其他交叉类型的一部分时，直观上表现不出来，还是会认为是不同基本类型的组合
> - 接口之间的继承关系会缓存，而交叉类型会被看成组合起来的一个整体
> - 在检查一个目标交叉类型时，在检查到目标类型之前会先检查每一个组分

## 参考文章

[TypeScript 中手册](https://typescript.bootcss.com/interfaces.html)
[TypeScript Interface vs Type 知多少](https://juejin.cn/post/6844904114925600776#heading-11)
