interface Person {
  name: string;
  age: number;
}

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

type MyExclude<T, U> = T extends U ? never : T;

type MyExtract<T, U> = T extends U ? T : never;

type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

type MyReturnType<T> = T extends (...args: any) => infer R ? R : any;

type PromiseResType<T> = T extends Promise<infer R> ? R : any;

type X = MyReturnType<() => number>;
