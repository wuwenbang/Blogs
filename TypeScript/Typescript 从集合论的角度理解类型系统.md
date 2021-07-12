## 1. 前言

在学习和使用 `TypeScript` 的过程中，有一些问题一直困惑着我：

1. 比如说联合类型（Union Types）与交叉类型（Intersection Types）在基础类型和对象类型上的不同表现：

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

// extends => 未知领域
type T3 = number extends {} ? true : false // T3 = true
```

我们用传统的
