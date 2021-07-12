type Fun = () => string

// 获取 Fun 返回值的类型
type T1 = ReturnType<Fun> // T1 = string

type T2 = ReturnType<() => { x: number; y: number }> // T2 = {x:number,y:number}
