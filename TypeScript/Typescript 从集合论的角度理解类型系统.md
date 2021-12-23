## 0. 前言

在学习和使用 `TypeScript` 的过程中，有一些问题一直困惑着我：

1. 比如说**联合类型**与**交叉类型**在基础类型和对象类型上的不同表现：

- 对于基础类型来说，联合类型是类型的并集，交叉类型是类型的交集。

```ts
// 联合类型
type Union = string | number // Union = string | number
// 交叉类型
type Intersection = string & number // Intersection = never
```

- 对于对象类型来说，联合类型是属性的交集，交叉类型是属性的并集。

```ts
interface A {
  x: number
  y: number
}
interface B {
  y: number
  z: number
}
// 联合类型
type Union = A | B
/* 
Union = {
  y: number
}
*/

// 交叉类型
type Intersection = A & B
/* 
Intersection = {
  x: number
  y: number
  z: number
}
*/
```

2. 再比如说条件类型的 `extends` 关键字到底是什么意思——可继承？可扩展？还是可赋值？

```ts
// extends => 可赋值 ？
type T1 = string extends string | number ? true : false // T1 = true

// extends => 可继承 ？
interface ObjectA {
  x: string
  y: string
}
interface ObjectB {
  x: string
}
type T2 = ObjectA extends ObjectB ? true : false // T2 = true
```

上述的例子确实令人困惑，或许我们应该换个角度去思考：尝试用集合论的角度去思考 `TypeScript` 的类型系统。

## 1. 类型与集合

在 `JavaScript` 里，**类型**是满足某些特征的**值的集合**。例如：

- `number` 类型是是所有数字的集合。
- `string` 类型是所有字符串的集合。
- `bolean` 类型是 `true` 和 `false` 的集合。
- `undefined` 类型是 `undefined` 的集合。

总结一下就是：**类型** 对应集合论里的 **集合**，**值** 对应集合论里的 **元素**。<br>
而在 `TypeScript` 里，我们可以给变量声明类型，并将对应类型的值赋予它。

```ts
let str: string = 'xxx'
str = 'yyy'
let num: number = 123
num = 456
```

而对于对象的类型，也就是类（Class），集合的概念就非常容易混淆，我们来看下面一个例子：

```ts
interface A {
  x: number
}
interface B {
  x: number
  y: number
}
const b: B = {
  x: 1,
  y: 2,
}
const a: A = b // ok
```

示例中，对象 `b` 的类型是 `{ x: number, y: number }`，但是它却可以赋值给类型为 `{ x: number }` 的变量 `a`。这看似不合理的现象，通过集合论的观点便可以解释：<br>
我们把类 `A` 即 `{ x: number }` 看成**所有拥有属性 `x: number` 的对象的集合**，也就是说只要拥有属性 `x: number` 的对象都可以看成集合 `A` 的一个元素（或者类 `A` 的实例）。<br>
那么因为 `b = { x:1, y:2 }` 拥有属性 `x: number` => 所以对象 `b` 是类 `A` 的一个实例 => 所以 `b` 可以赋值给类型为 `A` 的变量 `a`。<br>
关于对象，我们必须清晰地知道：**对象类型（类）是若干对象的集合，而不是属性的集合。只要一个对象具有类所描述的全部属性，那么该对象就是该类的元素（实例）。**<br>

## 2. 交叉类型与联合类型

* **交叉类型（Intersection Types）** 对应集合论的 **交集（Intersection）**<br>
* **联合类型（Union Types）** 对应集合论的 **并集（Union）**<br>
（PS：从英文原文翻译的角度来看，我认为将 交叉类型与联合类型 翻译成 交集类型和并集类型 可能更加贴切。）<br>

### 2.1 交叉类型与联合类型的简单运算

关于交叉类型 `&` 和联合类型 `|` 的运算，我们来看一个简单的例子：

```ts
type A = 1 | 2
type B = 2 | 3
// A B 交集
type C = A & B // C = 2
// A B 并集
type D = A | B // D = 1 | 2 | 3
// A number 交集
type E = A & number // E = A = 1 | 2
// A number 并集
type F = A | number // F = number
// 空集 never
type G = number & string // G = never
// 全集 unknown
type H = number | unknown // H = unknown
```

- A - F 符合集合论交集并集的运算规律
- G `never` 意为不会出现的类型，其符合空集的计算规律，遂可以理解为空集。
- H `unkonwn` 意为未知的类型，其符合全集的计算规律，遂可以理解为全集。

集合论中交集与并集的运算特性，交叉类型和联合类型也满足：<br>
对于交集运算符 `&`：

1. 唯一性: `A & A` 等价于 `A`.
2. 满足交换律: `A & B` 等价于 `B & A` .
3. 满足结合律: `(A & B) & C` 等价于 `A & (B & C)`.
4. 父类型收敛: 当且仅当 `B` 是 `A` 的父类型时，`A & B` 等价于 `A`.

对于并集运算符 `|`：

1. 唯一性: `A | A` 等价于 `A`.
2. 满足交换律: `A | B` 等价于 `B | A`.
3. 满足结合律: `(A | B) | C` 等价于 `A | (B | C)`.
4. 子类型收敛: 当且仅当 `B` 是 `A` 的子类型时，`A | B` 等价于 `A`.

### 2.2 交叉类型与联合类型高级运算

对于对象类型的交叉类型和联合类型，同样符合集合论的规律：

#### 交叉类型高级运算

```ts
interface A {
  x: number
  y: number
}
interface B {
  y: number
  z: number
}
// 交叉类型
type Intersection = B & A

const obj1: Intersection = {
  x: 1,
  y: 2,
  z: 3,
}

obj1.x // ok
obj1.y // ok
obj1.z // ok
```

- 交叉类型 `Intersection` 是对象 `A` 和 `B` 的交集，是**对象集合的交集**，表现为拥有 `A` 和 `B` 的全部属性，是**属性集合的并集**。。
- 赋值上：只有具有 `A` 和 `B` 所有的属性的对象才能赋值给 `Intersection`。
- 访问上：交叉类型 `Intersection` 可以访问 `A` 和 `B` 的**所有属性**。

#### 联合类型高级运算

```ts
interface A {
  x: number
  y: number
}
interface B {
  y: number
  z: number
}
// 联合类型
type Union = B | A

const obj1: Union = {
  x: 1,
  y: 2,
  z: 3,
}
const obj2: Union = {
  x: 1,
  y: 2,
}
const obj3: Union = {
  y: 2,
  z: 3,
}

obj1.x // error
obj1.y // ok
obj1.z // error
```

- 联合类型 `Union` 是对象 `A` 和 `B` 的并集，即**对象集合的并集**。
- 赋值上：具有 `A`或`B`或`A & B` 的属性的对象能赋值给 `Union`。
- 访问上：为了类型安全，联合类型 `Union` 只能访问 `A` 和 `B` 的**共有属性**。

## 3 extends 关键字

根据集合论，`A extends B` 的语意是： `A` 为 `B` 的**子集**。

### 3.1 extends 用作泛型约束

- 表达式：`T extends U`
- 作用：泛型约束用作限制泛型的类型，即`泛型T`必须是`类型U`的子集，才能通过编译。

```ts
function needNumber<T extends number>(value: T): number {
  return value + 1
}
// 满足 number 类型的子集
needNumber(1) //ok
// 不是 number 类型的子集
needNumber('1') //error
```

对象类型同理：

```ts
interface Point {
  x: number
  y: number
}
function Sum<T extends Point>(value: T): number {
  return value.x + value.y
}
// 满足 Point 类型的子集
Sum({ x: 1, y: 2 }) // ok
Sum({ x: 1, y: 2, z: 3 }) // ok
// 不是 Point 类型的子集
Sum({ x: 1 }) // error
```

### 3.2 extends 用作条件泛型

- 表达式：`T extends U ? X : Y`
- 作用：条件类型是一个三元运算表达式，如果 `T` 是 `U` 的子集，则表达式的值为 `X`，否则为 `U`。

```ts
type IsNumber<T> = T extends number ? true : false
type Result1 = IsNumber<1> // true
type Result2 = IsNumber<'1'> // false
```

对象类型同理：

```ts
interface Point {
  x: number
  y: number
}
type IsPointSubset<T> = T extends Point ? true : false
type Result1 = IsPointSubset<{ x: number; y: number }> // true
type Result2 = IsPointSubset<{ x: number; z: number }> // false
```

## 4. 参考资料
- [TypeScript 中文手册](https://typescript.bootcss.com/)
- [Typescript 进击的基础（一）交叉类型和联合类型-集合论角度理解](https://juejin.cn/post/6847902223402270728)