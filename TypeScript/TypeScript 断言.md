## 1. 类型断言

在使用 `TypeScript` 的过程中，你可能会遇到这种情况：你比 `TypeScript` 更加清楚某个值的类型。
比如你从异步请求中拿到一个类型为`any`的值，但你清楚的知道这个值就是`string`类型，这个时候你可以通过**类型断言**方式告诉编译器："嘿！相信我，我知道我在干什么！"。类型断言有点类似于其他语言的类型转换，但它没有运行时的影响，只是在编译阶段起作用。
类型断言有两种形式：

### 1.1 尖括号语法

- 形式：`<类型>变量名`

```ts
let value: any = "this is a string";
let length: number = (<string>value).length;
```

### 1.2 as 语法

- 形式：`变量名 as 类型`

```ts
let value: any = "this is a string";
let length: number = (value as string).length;
```

## 2. 非空断言

当你明确知道某个值不可能为 `undefined` 和 `null` 时，你可以用 在变量后面加上一个 `!`（非空断言符号）来告诉编译器："嘿！相信我，我确信这个值不为空！"。
非空断言具体的使用场景如下：

```ts
function fun(value: string | undefined | null) {
  const str: string = value; // error value 可能为 undefined 和 null
  const str: string = value!; //ok
  const length: number = value.length; // error value 可能为 undefined 和 null
  const length: number = value!.length; //ok
}
```

## 3. 确定赋值断言

`TypeScript` 的确定赋值断言，允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 `TypeScript` 该属性会被明确地赋值。

```ts
let name!: string;
```

上述表达式就是对编译器说："有一个名为 `name` 的属性，其类型为 `string | undefined`。它以值 `undefined` 开始。但每次获取或设置该属性时，我都希望将其视为类型 `string。`"

为了更好地理解它的作用，我们来看个具体的例子：

```ts
let count: number;
initialize();

// Variable 'count' is used before being assigned.(2454)
console.log(2 * count); // Error

function initialize() {
  count = 10;
}
```

很明显该异常信息是说变量 `count` 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：

```ts
let count!: number;
initialize();
console.log(2 * count); // Ok

function initialize() {
  count = 10;
}
```
