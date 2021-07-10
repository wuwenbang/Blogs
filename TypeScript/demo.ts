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
