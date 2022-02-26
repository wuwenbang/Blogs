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

// 发布订阅
const eventHub = {
  map: {},
  on(name, fn) {
    // 入队
    eventHub.map[name] = eventHub.map[name] || [];
    eventHub.map[name].push(fn);
  },
  off(name, fn) {
    const list = eventHub.map[name];
    if (!list) return;
    const index = list.indexOf(fn);
    if (index < 0) return;
    list.splice(index, 1);
  },
  emit(name, data) {
    const list = eventHub.map[name];
    if (!list) return;
    list.map((f) => f(data));
  },
};

// 手写AJAX
// var request = new XMLHttpRequest();

// request.open('GET', '/xxx');
// request.onreadystatechange = () => {
//   if (request.readyState === 4) {
//     if (
//       (request.status >= 200 && request.status < 300) ||
//       request.status === 304
//     ) {
//       console.log('success');
//     } else {
//       console.log('failed');
//     }
//   }
// };
// request.onerror = () => {
//   console.log('error');
// };
// request.send('{"name":"frank"}');

// 数组去重
function unique(list) {
  const result = [];
  for (let item of list) {
    if (result.indexOf(item) === -1) {
      result.push(item);
    }
  }
}
// 手写 Promise

class Promise2 {
  constructor(fn) {}
  then(f1, f2) {}
  catch() {}
}

// 手写深拷贝
function deepClone(x, cache) {
  // 解决循环引用
  if (!cache) {
    cache = new Map();
  }
  if (cache.get(x)) return x;
  let result;
  // 如果是对象(引用类型)
  if (x instanceof Object) {
    // 开辟内存空间
    // 如果是函数
    if (x instanceof Function) {
      // 如果是普通函数
      if (x.prototype) {
        result = function () {
          return x.apply(this, arguments);
        };
      }
      // 如果是箭头函数
      else {
        result = (...args) => x.call(undefined, args);
      }
    }
    // 如果是数组
    else if (x instanceof Array) {
      result = [];
    }
    // 如果是日期
    else if (x instanceof Date) {
      result = new Date(x.valueOf());
    }
    // 如果是正则
    else if (x instanceof RegExp) {
      result = new RegExp(x.source, x.flags);
    }
    // 如果是普通对象
    else {
      result = {};
    }
    cache.set(x, result);
    // 赋值属性 递归调用
    for (let key in x) {
      // 判断属性是否在对象身上
      if (x.hasOwnProperty(key)) {
        result[key] = deepClone(x[key], cache);
      }
    }
  }
  // 如果是值类型
  else {
    result = x;
  }
  return result;
}
