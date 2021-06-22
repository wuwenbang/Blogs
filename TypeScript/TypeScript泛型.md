### 泛型

概念：类型参数，可以理解为广泛的类型
作用：可以看作一个存储类型的临时变量：在**函数调用的时候**去指定函数的**参数类型**和**返回值类型**

```typescript
function fun<T>(param: T): T {
  return param;
}
console.log(fun(true)); // true
console.log(fun(1)); // 1
console.log(fun("1")); // '1'
console.log(fun([1, 2, 3])); // [1, 2, 3]
```
