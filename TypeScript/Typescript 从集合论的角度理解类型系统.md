## 0 前言

在学习和使用 `TypeScript` 的过程中，有一些问题一直困惑着我：

1. 比如说联合类型（Union Types）与交叉类型（Intersection Types）在基础类型和对象类型上的不同表现：

- 对于基础类型来说，联合类型是类型的并集，交叉类型是类型的交集。

```ts
// 联合类型
type Union = string | number; // Union = string | number
// 交叉类型
type Intersection = string & number; // Intersection = never
```

- 对于对象类型来说，联合类型是属性的交集，交叉类型是属性的并集。

```ts
interface A {
  x: number;
  y: number;
}
interface B {
  y: number;
  z: number;
}
// 联合类型
type Union = A | B;
/* 
Union = {
  y: number
}
*/

// 交叉类型
type Intersection = A & B;
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
type T1 = string extends string | number ? true : false; // T1 = true

// extends => 可继承 ？
interface ObjectA {
  x: string;
  y: string;
}
interface ObjectB {
  x: string;
}
type T2 = ObjectA extends ObjectB ? true : false; // T2 = true
```

上述的例子确实令人困惑，或许我们应该换个角度去思考：尝试用集合论的角度去思考 `TypeScript` 的类型系统。

## 1 类型与集合

在 `JavaScript` 里，**类型**是满足某些特征的**值的集合**。例如：

- `number` 类型是是所有数字的集合。
- `string` 类型是所有字符串的集合。
- `bolean` 类型是 `true` 和 `false` 的集合。
- `undefined` 类型是 `undefined` 的集合。

总结一下就是：**类型** 对应集合论里的 **集合**，**值** 对应集合论里的 **元素**。<br>
而在 `TypeScript` 里，我们可以给变量声明类型，并将对应类型的值赋予它。

```ts
let str: string = "xxx";
str = "yyy";
let num: number = 123;
num = 456;
```

而对于对象的类型，也就是类（Class），集合的概念就非常容易混淆，我们来看下面一个例子：

```ts
interface A {
  x: number;
}

const obj = {
  x: 1,
  y: 2,
};
const a: A = obj; // ok
```

示例中，对象 `obj` 的类型是 `{ x:number, y:number }`，但是它却可以赋值给类型为 `{ x: number }` 的变量 `a`。这看似不合理的现象，通过集合论的观点便可以解释：我们把类 `A` 即 `{ x: number }` 看成**所有拥有属性 `x` 的对象的集合**，也就是说只要拥有属性 `x` 的对象都已看成集合 `A` 的一个元素。那么 `obj = { x:1, y:2 }` 是拥有属性 `x` 的对象吗？显然是的。所以对象 `obj` 是类 `A` 的一个子集，所以 `obj` 可以赋值给 `a`。<br>

## 2 交叉类型与联合类型

## 3 extends 关键字

### 1.2 集合论基础知识

为了更好的理解类型，我们这里还需要重拾一下集合论的知识：

（大写字母 $A$ $B$ 表示集合，小写字母 $x$ 表示集合中的元素）

1. 集合与元素的关系：
   - 若 $x$ 是集合 $A$ 的元素，记作 $x \in A$。
   - 若 $x$ 不是集合 $A$ 的元素，记作 $x \notin A$。
2. 集合与集合之间的关系：
   - 若 $A$ 中的元素都是 $B$ 中的元素，则称 $A$ 是 $B$ 的子集，记作 $A \subset B$
3. 集合之间的运算：
   - 交集：由 $A$ 和 $B$ 公共元素组成的集合，记作 $A \cap B$
   - 并集：由 $A$ 和 $B$ 所有元素组成的集合，记作 $A \cup B$
