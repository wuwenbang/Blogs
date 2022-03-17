function fn(str) {
  const list = str.split(',').map((item) => parseInt(item));
  let slow = 0;
  let fast = 0;
  const result = [];
  while (fast < list.length) {
    if (list[fast + 1] !== list[fast] + 1) {
      if (fast > slow) {
        result.push(list[slow] + '~' + list[fast]);
      } else {
        result.push(list[slow]);
      }
      fast++;
      slow = fast;
    } else {
      fast++;
    }
  }
  return result.join(',');
}

console.log(fn('1,2,3,6,7,9,10,11,12,13,56'));
