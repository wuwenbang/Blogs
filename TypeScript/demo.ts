interface Point {
  x: number
  y: number
}
type IsPointSubset<T> = T extends Point ? true : false
type Result1 = IsPointSubset<{ x: number; y: number }> // true
type Result2 = IsPointSubset<{ x: number; z: number }> // false
