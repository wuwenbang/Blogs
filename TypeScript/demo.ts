interface MyObject<T = any> {
  key: T;
}

type StrObject = MyObject<string>;
type NumObject = MyObject<number>;

type ObjectMember<T> = T extends MyObject<infer V> ? V : never;
type StrObjectMember = ObjectMember<StrObject>; // string
type NumObjectMember = ObjectMember<NumObject>; // number
