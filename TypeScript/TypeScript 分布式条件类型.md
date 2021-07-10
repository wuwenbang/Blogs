## 1. 问题

最近遇见一个关于 TypeScript 条件类型的问题，非常的有意思：

```ts
type T1 = "x" | "y";
type AB<T> = T extends "x" ? "a" : "b";
type AB1 = T1 extends "x" ? "a" : "b"; // 为什么这样写类型推断为 'b'
type AB2 = AB<T1>; // 而这样写就是推断为 'a' | 'b'
```

`AB1`和`AB2`都是被一个**条件类型**赋值，的我们可以看到：

- `AB1` 走的是 `false` 路径，返回的 `"b"`
- `AB2` 既没有走 `false` 路径，也没有走 `true` 路径，而是返回一个联合类型 `"a"|"b"`

这就非常奇怪了，按通常的理解，将泛型参数`T1 = "x" | "y"`代入，`AB2` 应该等于 `"x" | "y" extends "x" ? "a" : "b"` ，
得出的结果应该同 `AB1` 一致为 `"b"`，但是它竟然返回的是一个联合类型。

经过翻阅 [TypeScript 2.8](https://www.tslang.cn/docs/release-notes/typescript-2.8.html) 的文档，终于得知`AB2`这种类型是 `TypeScript` 的一种特殊类型：**分布式条件类型（Distributive Conditional Types）**。

## 2. 分布式条件类型

官方定义：

> Conditional types in which the checked type is a naked type parameter are called distributive conditional types. Distributive conditional types are automatically distributed over union types during instantiation. For example, an instantiation of T extends U ? X : Y with the type argument A | B | C for T is resolved as (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y).

我们来一段一段分析一下官方文档的定义：

> **Conditional types** in which **the checked type** is a **naked type parameter** are called **distributive conditional types**.

译：在**条件类型**中，如果**被检查的类型**是**裸类型**，则被称为**分布式条件类型**。

- 被检查的类型（the checked type）： 条件类型中 `extends` 左边的类型。
- 裸类型（the checked type）：未被其他类型包裹类型，比如说`string`、`number` 等。那么被包裹的类型有哪些呢？比如数组、元组、函数、`Promise`等。

> Distributive conditional types are **automatically distributed** over **union types** during **instantiation**.

译：分布式条件类型在**实例化**时，会**自动分发**成**联合类型**。

- 实例化（instantiation）：这里实例化我的理解是声明的泛型被调用
