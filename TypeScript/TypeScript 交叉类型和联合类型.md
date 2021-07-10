# 交叉类型（Intersection Types）

- 表示: `type1 & type2`
- 描述: 交叉类型是将多个类型合并为一个新的类型。这让我们可以把现有的多种类型叠加到一起成为一种新类型，从而同时拥有它们的**全部属性**。（交叉类型一般是对两个对象类型使用如`Object1 & Object2`，如果是基础类型如`string & number`，得到的结果将会是`never`——永远不会出现的类型）
- 示例:

```ts
// 鸟类(可以飞行的那种)
type Bird = {
  name: string
  fly: () => void
}
// 鱼类(可以游泳的那种)
type Fish = {
  name: string
  swin: () => void
}

// 交叉类型BirdFish 拥有共有属性name，并且还同时拥有 fly方法 和 swin方法
type BirdFish = Bird & Fish
const birdFish: BirdFish = {
  name: 'xxx',
  fly: () => console.log('fly'),
  swin: () => console.log('swin'),
}
birdFish.name //ok
birdFish.fly() //ok
birdFish.swin() //ok
```

- 结论: 结合上述示例，用集合论的方式来描述：交叉类型其实就是两个对象属性的**并集**。

# 联合类型（Union Types）

- 表示: `type1 | type2`
- 描述: 联合类型应该是我们在 TypeScript 使用得最多的特性之一，它使用`|`把多个类型连起来，表示它有可能是这些类型中的其中一个。`|` 应该理解成 `or` ，`A | B` 表示 A 或 B 的结果，它只可能是其中一个，这也就意味着它的类型是不确定的。
- 示例

1. 基础联合类型

```ts
// week只能为 1-7 之中的数字
type Week = 1 | 2 | 3 | 4 | 5 | 6 | 7

let weekday1: Week = 1 // ok
let weekday2: Week = 8 // error
```

2. 对象联合类型

```ts
// 猫科
interface ICat {
  run(): void
  meow(): void
}
// 犬科
interface IDog {
  run(): void
  bark(): void
}
// 某种猫的实现
class Cat implements ICat {
    run() { };
    meow() { };
}
// 获取动物： ICat | IDog（可能是猫科也可能是犬科）
const getAnimal = (): ICat | IDog {
    // 返回猫
    return new Cat();
}

const animal = getAnimal();
// 只能调用 ICat | IDog 的共有方法run ，不能调用 ICat 的私有方法meow
animal.run(); // ok
animal.meow(); // error
```

- 结论: 结合上述示例，用集合论的方式来描述：对象联合类型其实就是两个对象属性的**交集**。
