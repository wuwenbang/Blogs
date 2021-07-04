## 1. 泛型是什么？

- 官方的定义是：

  > **泛型（Generics）**是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

- 通俗的解释是：泛型是类型系统中的**参数**，就像函数的参数一样，只不过函数的参数传递的是值，而泛型传递的是**类型**。他只出现在现在**函数**，**接口**，和**类**中，主要作用是为了类型的复用。

* 设计泛型的关键目的：是在成员之间提供有意义的约束，这些成员可以是：函数参数、函数返回值、类的实例成员和类的方法。

可能这么讲会有一些抽象，接下来我们以泛型函数为例，举一个简单的例子：

1. 首先我们来定义一个通用的 `identity` 函数，该函数接收一个`number`类型的参数，并直接返回这个值：

```ts
function identity(value: number): number {
  return value;
}
identity(1); // ok

identity("hello"); // error
// 编译器报错： Argument of type 'string' is not assignable to parameter of type 'number'.ts(2345)
```

2. 现在，`identity` 函数能且只能传入 `number` 类型的参数，如果我想传入 `string` 类型的 `TypeScript` 编译器会报错，那么该怎么办呢？或许你会想到 `any` 类型。

```ts
function identity(value: any) {
  return value;
}
identity(1); // ok
identity("hello"); // ok
```

3. 好吧，传入 `any` 确实可以生效，但我们失去了定义应该返回哪种类型的能力，并且在这个过程中也丧失了 `TypeScript` 的类型保护作用。

我们的目标是让 `identity` 函数可以适用于任何特定的类型，为了实现这个目标，我们可以使用 **泛型函数** 来解决这个问题：

## 2. 泛型函数

定义泛型函数：

```ts
function identity<T>(value: T): T {
  return value;
}
identity<number>(1); // ok
identity<string>("hello"); // ok
```

对于刚接触 `TypeScript` 泛型的读者来说，首次看到 `<T>` 语法会感到陌生。但这没什么可担心的，就像传递参数一样，通过参数变量 `T`，把用户想要传入的类型，链式传递到后面函数的类型定义中去。

![泛型传递](https://user-gold-cdn.xitu.io/2020/6/10/1729b3d9774a21ac?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

（图片来源：[掘金阿宝哥](https://juejin.cn/post/6844904184894980104)）

参考上面的图片，通过 `<T>` 声明 **类型变量 `T`**，然后在后面的函数参数类型声明、和函数返回值类型声明中使用：`(value: T): T`。

理论上，`< >`类可以声明任意字符作为类型变量，但在定义泛型时通常用`T`作为类型变量名称，其中 `T` 代表 `Type`。当然，除了 `T` 之外，以下是常见泛型变量代表的意思：

- K（Key）：表示对象中的键类型。
- V（Value）：表示对象中的值类型。
- E（Element）：表示元素类型。
- U（T 后面的字符）：表示第二个类型参数（以此类推）。

很多时候并不是只能定义一个类型变量，我们可以引入更多的类型变量。比如我们引入一个新的类型变量 `U`，用于扩展我们定义的 `identity` 函数：

```ts
function identity<T, U>(value: T, message: U): T {
  console.log(message);
  return value;
}

console.log(identity<Number, string>(100, "Hello Generics"));
// Hello Generics
// 100
```

![泛型传递](https://user-gold-cdn.xitu.io/2020/6/10/1729b3dbccc38ea7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

（图片来源：[掘金阿宝哥](https://juejin.cn/post/6844904184894980104)）

除了为类型变量显式设定值之外，一种更常见的做法是使编译器自动选择这些类型，从而使代码更简洁。我们可以完全省略尖括号，比如：

```ts
function identity<T, U>(value: T, message: U): T {
  console.log(message);
  return value;
}

console.log(identity(100, "Hello Generics"));
// Hello Generics
// 100
```

## 3. 泛型接口

定义泛型接口：

```ts
interface GenericInterface<T> {
  data: T;
}
```

接口泛型的使用方式和函数类似，我们可以通过`<T>`来声明参数变量`T`，并将其用在后面接口属性的类型定义上。

泛型接口常用于定义那些，需要用户自定义类型的对象上，最常见的就是 网络请求的响应对象了，以`Axios`为例：
假设我们通过 `axios.get` 发起网络请求，我们可以通过`axios.get<DataType>`传入`data`的类型，最后拿响应 `res` 时，我们就可以明确的知道`data`的数据类型 ：

```ts
interface DataType {
  id: number;
  message: string;
}
axios.get<DataType>("https://www.xxx.com").then((res) => {
  console.log(res.data.message);
});
```

其中`axios`实例，以及响应`res`的泛型接口如下定义：

```ts
interface AxiosInstance {
  // ...
  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R>;
}

interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}
```

其中响应的 `data` 是 `axios` 不知道的，所以 `axios` 通过泛型的方式，将类型`T`传递给后面的`data`属性。

## 4. 泛型类

在类中使用泛型也很简单，我们只需要在类名后面，使用 `<T, ...>` 的语法定义任意多个类型变量。

定义泛型类：

```ts
interface GenericInterface<U> {
  value: U;
  getValue: () => U;
}

class GenericClass<T> implements GenericInterface<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const myNumberClass = new GenericClass<number>(10);
console.log(myNumberClass.getValue()); // 10

const myStringClass = new GenericClass<string>("Hello Generics!");
console.log(myStringClass.getValue()); // Hello Generics!
```

接下来我们以实例化 `myNumberClass` 为例，来分析一下其调用过程：

1. 在实例化 `GenericClass` 对象时，我们传入 `number` 类型和构造函数参数值 68；
2. 之后在 `GenericClass` 类中，类型变量 `T` 的值变成 `number` 类型；
3. `GenericClass` 类实现了 `GenericInterface<T>`，而此时 `T` 表示 `number` 类型，因此等价于该类实现了 `GenericInterface<number>` 接口；
4. 而对于 `GenericInterface<U>` 接口来说，类型变量 `U` 也变成了 `number`。这里我有意使用不同的变量名，以表明类型值沿链向上传播，且与变量名无关。

## 5. 泛型约束

有时候我们希望限制泛型变量接受的类型（比如我只希望接受拥有`.length`属性的类型），我们就需要**泛型约束**。下面我们来举几个例子，介绍一下如何使用泛型约束。

### 5.1 确保属性存在

有时候，我们希望类型变量对应的类型上存在某些属性。这时，除非我们显式地将特定属性定义为类型变量，否则编译器不会知道它们的存在。
一个很好的例子是在处理字符串或数组时，我们会假设 `length` 属性是可用的。让我们再次使用 `identity` 函数并尝试输出参数的长度：

```ts
function identity<T>(arg: T): T {
  console.log(arg.length); // error: T doesn't have .length
  return arg;
}
```

在这种情况下，编译器将不会知道 `T` 确实含有 `length` 属性，尤其是在可以将任何类型赋给类型变量 `T` 的情况下。我们需要做的就是让类型变量 `extends` 一个含有我们所需属性的接口，比如这样：

```ts
interface Length {
  length: number;
}

function identity<T extends Length>(arg: T): T {
  console.log(arg.length); // ok: 可以获取length属性
  return arg;
}
```

`T extends Length` 用于告诉编译器，我们支持已经实现 `Length` 接口的任何类型。

之后，当我们使用不含有 `length` 属性的对象作为参数调用 `identity` 函数时，`TypeScript` 会提示相关的错误信息：

```ts
identity(10); // Error
// Argument of type '68' is not assignable to parameter of type 'Length'.(2345)
```

### 5.2 检查对象上的键是否存在

泛型约束的另一个常见的使用场景就是检查对象上的键是否存在。不过在看具体示例之前，我们得来了解一下 `keyof` 操作符，该操作符可以用于**获取某种类型的所有键**，其返回类型是**联合类型**。我们来举个 `keyof` 的使用示例：

```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[]; // number | "length" | "push" | "concat" | ...
```

通过 `keyof` 操作符，我们就可以获取指定类型的所有键，之后我们就可以结合前面介绍的 `extends` 约束，即限制输入的属性名包含在 `keyof` 返回的联合类型中。具体的使用方式如下：

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const obj = {
  name: "tom",
};

getProperty(obj, "name"); // ok
getProperty(obj, "age"); // error 属性名 age 不存在 obj 上
```

在以上的 `getProperty` 函数中，我们通过` K extends keyof T` 确保参数 `key` 一定是对象中含有的键，这样就不会发生运行时错误。这是一个类型安全的解决方案，与简单调用 `let value = obj[key];` 不同。

在以上示例中，对于 `getProperty(obj, "age")` 这个表达式，`TypeScript` 编译器会提示以下错误信息：

```ts
// 编译器报错：Argument of type '"age"' is not assignable to parameter of type '"name"'.ts(2345)
```

很明显通过使用泛型约束，在编译阶段我们就可以提前发现错误，大大提高了程序的健壮性和稳定性。

## 6. 泛型参数默认类型

我们都知道 `JavaScript` 的函数参数可以设置初始值（`defalut value`），类似地，我们也可以为泛型参数设置默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推断出类型时，这个默认类型就会起作用。
泛型参数默认类型与普通函数默认值类似，对应的语法很简单，即 `<T=Default Type>`，对应的使用示例如下：

```ts
interface MyObject<T = string> {
  id: T;
}

const numObject: MyObject = { id: "abc" };
const strObject: MyObject<number> = { id: 123 };
```

泛型参数的默认类型遵循以下规则：

- 有默认类型的类型参数被认为是**可选的**。
- 必选的类型参数不能在可选的类型参数后。
- 如果类型参数有约束，类型参数的默认类型必须满足这个约束。
- 当指定类型实参时，你只需要指定必选类型参数的类型实参。 未指定的类型参数会被解析为它们的默认类型。
- 如果指定了默认类型，且类型推断无法选择一个候选类型，那么将使用默认类型作为推断结果。
- 一个被现有类或接口合并的类或者接口的声明可以为现有类型参数引入默认类型。
- 一个被现有类或接口合并的类或者接口的声明可以引入新的类型参数，只要它指定了默认类型。

## 7. 泛型条件类型

通过**泛型条件类型**，我们可以根据某些条件得到不同的类型，这里所说的条件是类型兼容性约束。尽管以上代码中使用了 `extends` 关键字，也不一定要强制满足继承关系，而是检查是否满足结构兼容性。

条件类型会以一个条件表达式进行类型关系检测，从而在两种类型中选择其一：
`T extends U ? X : Y`
以上表达式的意思是：若 `T` 能够赋值给 `U`（`T` 属于与 `U`的子类），那么类型是 `X`，否则为 `Y`。在条件类型表达式中，我们通常还会结合 `infer` 关键字，实现类型抽取：

```ts
interface MyObject<T = any> {
  key: T;
}

type StrObject = MyObject<string>;
type NumObject = MyObject<number>;

type ObjectMember<T> = T extends MyObject<infer V> ? V : never;
type StrObjectMember = ObjectMember<StrObject>; // string
type NumObjectMember = ObjectMember<NumObject>; // number
```

在上面示例中，当类型 `T` 满足 `T extends MyObject` 约束时，我们会使用 `infer` 关键字声明了一个类型变量 `V`，并返回该类型，否则返回 `never` 类型。

## 8. 参考文章

- [TypeScript 中文手册](https://typescript.bootcss.com/basic-types.html)
- [一份不可多得的 TS 学习指南](https://juejin.cn/post/6872111128135073806#heading-28)
