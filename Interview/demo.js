// 手写 new 函数
function _new(constructor, ...args) {
  const obj = {};
  obj.__proto__ = constructor.prototype;
  const result = constructor.apply(obj, args);
  return typeof result === 'object' ? result : obj;
}

// 冒泡排序
function bubbleSort(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = 0; j < nums.length - i - 1; j++) {
      if (nums[j] > nums[j + 1]) {
        let temp = nums[j];
        nums[j] = nums[j + 1];
        nums[j + 1] = temp;
      }
    }
  }
  return nums;
}

// 选择排序
function selectSort(nums) {
  let index = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    index = i;
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] < nums[index]) index = j;
    }
    if (nums[i] > nums[index]) {
      let temp = nums[i];
      nums[i] = nums[index];
      nums[index] = temp;
    }
  }
  return nums;
}

// 快速排序
const quickSort = (nums) => {
  if (nums.length < 2) {
    return nums;
  } else {
    let left = [];
    let right = [];
    let pivot = Math.floor(nums.length / 2);
    let base = nums.splice(pivot, 1);
    for (let num of nums) {
      if (num < base) {
        left.push(num);
      } else {
        right.push(num);
      }
    }
    return quickSort(left).concat(base, quickSort(right));
  }
};

console.log(quickSort([6, 45, 3, 2, 5, 6, 8, 4, 3, 4, 56, 67, 5]));
