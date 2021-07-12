## 前言

`Typescript` 中默认内置了很多工具泛型，通过使用这些工具，可以使得我们定义类型更加灵活，高效。本文将会介绍常用泛型工具的使用技巧，以及对其实现原理进行相应的解析，如果有错误的地方，还望指出。

## Partial\<T>

**作用**：将传入对象类型 `T` 的属性变为**可选属性**。

**示例**：

```ts
interface Person {
  name: string
  age: number
}

const tom: Partial<Person> = {
  name: 'Tom',
}
```

`Partial<Person>` 等价于

```ts
interface Person {
  name?: string
  age?: number
}
```

**实现原理**：

1. 通过关键字 `keyof` 将传入对象类型的键值转换为联合类型。
2. 通过关键字 `in` 遍历联合类型，即遍历对象的键值。
3. 通过类型映射，将对象的属性转换为**可选属性**

```ts
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}
```

## Readonly\<T>

**作用**：把传入对象类型 `T` 属性变为**只读属性**。

**示例**：

```ts
interface Person {
  name: string;
  age: number;
}

const tom: Readonly<Person> = {
  name: "Tom",
  age: 18;
};

tom.age = 22 // error
```

`Readonly<Person>` 等价于

```ts
interface Person {
  readonly name: string
  readonly age: number
}
```

**实现原理**：

与`Partial`类似：

1. 通过关键字 `keyof` 将传入对象类型的键值转换为联合类型。
2. 通过关键字 `in` 遍历联合类型，即遍历对象的键值。
3. 通过类型映射，将对象的属性转换为**只读属性**

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

## Required\<T>

**作用**：把传入对象类型 `T` 属性变为**必填属性**。

**示例**：

```ts
interface Person {
  name?: string;
  age?: number;
}

let tom: Required<Person>

tom = {
  name: "Tom",
  age: 18;
};
// ok

tom = {
  name: "Tom",
};
// error
```

**实现原理**：

与`Partial`类似：

1. 通过关键字 `keyof` 将传入对象的键值转换为枚举类型。
2. 通过关键字 `in` 遍历枚举类型，即遍历对象的键值。
3. 通过类型映射，再统一通过 `-` 修饰符移除 `?` 修饰符，从而转变为**必填状态**。

```ts
type Required<T> = {
  Required [P in keyof T]: T[P];
};
```

## Record\<K,T>

**作用**：它用来生成一个属性名为 `K`，属性值类型为 `T` 的对象类型集合。

**示例**：

```ts
// 快速生成一个 Person 对象
type Person = Record<'name' | 'country', string>

const Tom: Person = { name: 'Tom', country: 'America' }
```

**实现原理**:

1. 通过 `K extends keyof any` 对 `K` 参数进行约束，将其约束为任意类型 `any` 的键值。
2. 通过 `in` 对键值集合 `K` 进行遍历，然后生成类型为 `T` 的键值对集合。

```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T
}
```

## Exclude\<T,K>

**作用**：从类型 `T` 中排除所有可以赋值给类型 `U` 的类型。

**示例**：

```ts
// 从 "a" | "b" | "c" 中排除掉 "a" 类型
type T1 = Exclude<'a' | 'b' | 'c', 'a'>
// T1 = "b" | "c"

// 从 string | number | boolean 中排除掉 string 类型
type T2 = Exclude<string | number | boolean, string>
// T2 = number | boolean
```

**实现原理**：

1. 通过条件类型`T extends U ? never : T` 对 `T` 参数进行判别：
   - 如果 `T` 是 `U` 的子集，那么返回 `never`（即排除掉`T`）。
   - 如果 `T` 不是 `U` 的子集，那么返回 `T`。
2. 通过**分布式条件类型**，如果 `T` 为联合类型，则将条件类型的结果分发为**联合类型**。

```ts
type Exclude<T, U> = T extends U ? never : T
```

## Extract\<T,K>

**作用**：与 `Exclude` 相反，从类型 `T` 中提取所有可以赋值给类型 `U` 的类型。

**示例**：

```ts
// 从 "a" | "b" | "c" 中提取出 "a" 类型
type T1 = Extract<'a' | 'b' | 'c', 'a'>
// T1 = "a"

// 从 string | number | boolean 中提取出 string 类型
type T2 = Extract<string | number | boolean, string>
// T2 = string

type T3 = Extract<string | (() => void), Function>
// 相当于 type T3 = () => void;
```

**实现原理**：

与 `Exclude` 类似：

1. 通过条件类型`T extends U ? never : T` 对 `T` 参数进行判别：
   - 如果 `T` 是 `U` 的子集，那么返回 `T`。
   - 如果 `T` 不是 `U` 的子集，那么返回 `never`（即排除掉`T`）。
2. 通过**分布式条件类型**，如果 `T` 为联合类型，则将条件类型的结果分发为**联合类型**。

```ts
type Extract<T, U> = T extends U ? T : never
```

## Pick\<T,K>

**作用**：在 `T` 中，摘选出 `K` 属性。

**示例**：

```ts
interface Person {
  name: string
  age: number
}

// 从 Person 中摘选出 name 属性
type PickPerson = Pick<Person, 'name'>

const tom: PickPerson = {
  name: 'Tom',
}
```

**实现原理**：

1. 通过 `K extends keyof T` 对 `K` 参数进行约束，将其约束为 `T` 的键值范围内。
2. 通过 `in` 对键值集合 `K` 进行遍历，然后生成类型为 `T` 的键值对集合。

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

## Omit\<T,K>

**作用**：在 `T` 中，剔除掉 `K` 属性。

**示例**：

```ts
interface Person {
  name: string
  age: number
}

// 从 Person 中剔除掉 name 属性
type OmitPerson = Pick<Person, 'name'>

const tom: PickPerson = {
  age: 18,
}
```

**实现原理**：

1. 通过 `K extends keyof T` 对 `K` 参数进行约束，将其约束为 `T` 的键值范围内。
2. 通过 `Exclude<keyof T, K>` 将类型集合 `T` 中的 `K` 类型排除掉。
3. 通过 `Pick<T,Exclude<keyof T, K>>` 在 `T` 中摘选出排除掉 `K` 的 `T` 的属性。

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

## ReturnType\<T>

**作用**：获取函数的返回值类型。

**示例**：

```ts
type Fun = () => string

// 获取 Fun 返回值的类型
type T1 = ReturnType<Fun> // T1 = string

type T2 = ReturnType<() => { x: number; y: number }>
// T2 = { x: number, y: number }
```

**实现原理**：

1. 通过 `extends` 对 `T` 参数进行约束，`(...args: any) => any` 表示一个函数类型，即 `T` 参数的类型必须是一个**函数类型**。
2. `T extends U ? X : Y` 是条件类型（注意和之前表示约束的 `extends` 做区分），其中 `T` 是泛型参数，`U` 是**条件部分**，`X` 是符合条件的返回结果，`Y` 是不符合条件的返回结果。
3. 推断类型 `infer` 的作用是：在条件类型内部声明一个**类型变量**。`(...args: any) => infer R` 是条件类型的**条件部分**，它声明了一个类型变量 `R` ，用来存储函数的返回类型。
4. `T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any`表示：
   - 如果 `T` 是函数类型（`(...args: any) => infer R`），则返回 `R` , 即函数的返回类型。
   - 如果 `T` 不是函数类型（`(...args: any) => infer R`），则返回 `any`。

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```
