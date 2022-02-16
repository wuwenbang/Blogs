// 函数节流
function throttle(fn, wait) {
  let timer = null;
  return (...args) => {
    if (timer) return;
    fn(...args);
    timer = setTimeout(() => {
      timer = null;
    }, wait);
  };
}

// 函数防抖
function debounce(fn, wait) {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), wait);
  };
}

let f = debounce(() => console.log('hello'), 1000);
f();
setTimeout(() => {
  f();
}, 500);
