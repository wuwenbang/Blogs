function unique<T>(list: Array<T>) {
  const result: Array<T> = [];
  for (let item of list) {
    if (result.indexOf(item) === -1) {
      result.push(item);
    }
  }
  return result;
}

console.log(unique([1, 2, 3, 3, 3, 1, 2]));
