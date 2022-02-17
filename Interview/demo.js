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
    list.map(f => f(data));
  },
};

// 手写AJAX
var request = new XMLHttpRequest();

request.open('GET', '/xxx');
request.onreadystatechange = () => {
  if (request.readyState === 4) {
    if (
      (request.status >= 200 && request.status < 300) ||
      request.status === 304
    ) {
      console.log('success');
    } else {
      console.log('failed');
    }
  }
};
request.onerror = () => {
  console.log('error');
};
request.send('{"name":"frank"}');

// 手写 Promise

class Promise2{
  constructor(fn){

  }
  then(f1,f2){

  }
  catch(){

  }
}