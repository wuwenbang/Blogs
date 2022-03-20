Function.prototype._bind = function (context, ...args) {
  var that = this;
  return function () {
    that.apply(context, args);
  };
};

function fn() {
  console.log(this);
}
var obj = { a: 1 };
var fn1 = fn._bind(obj);
fn1();
