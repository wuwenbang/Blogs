interface Action {
  (): void;
}
const sayHi: Action = () => {
  console.log("Hi!");
};
sayHi();
