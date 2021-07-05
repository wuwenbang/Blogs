### 通过 JavaScript 实现拖动元素交换位置（如下图所示）

![drag.gif](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/610295dfd0e94a3da83303ecb9419a8e~tplv-k3u1fbpfcp-zoom-1.image)

### 实现方式

HTML5 提供了`draggable`属性，当它的值为`true`时，表示元素可拖动。<br>
在实现之前，首先我们需要明白两个单词的意思，分别是：**drag: 拖** 和 **drop: 放**，<br>
其次我们需要知道的是拖动元素的过程经历了哪些事件（以本次程序为例）

1. `ondragstart`: 当开始拖动元素时触发。
2. `ondragover`: 当拖动元素进入可放下的对象区域时触发。
3. `ondrop`: 当拖动元素被放下时触发。

接下来就可以阅读源码的具体实现了：

### 源码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drag Demo</title>
    <style>
      .box {
        width: 100px;
        height: 100px;
        margin: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: white;
      }
    </style>
    <script>
      // 存放拖拽的元素
      let dragElement = null
      function onDragStart(e) {
        // 获取当前拖拽元素
        dragElement = e.currentTarget
      }
      function onDragOver(e) {
        // 默认的当你dragover的时候会阻止你做drop的操作，所以需要取消这个默认
        e.preventDefault()
      }
      function onDrop(e) {
        // 当拖动结束的时候，给拖动div所在的位置下面的div做drop事件
        let dropElement = e.currentTarget
        if (dragElement != null && dragElement != dropElement) {
          let wrapper = document.querySelector('.wrapper')
          // 临时 div 用于存储 box
          let temp = document.createElement('div')
          // 添加 temp 到父元素 wrapper 中
          wrapper.appendChild(temp)
          // 交换
          wrapper.replaceChild(temp, dropElement)
          wrapper.replaceChild(dropElement, dragElement)
          wrapper.replaceChild(dragElement, temp)
        }
      }
    </script>
  </head>
  <body>
    <div class="wrapper" style="display: flex">
      <div
        class="box"
        style="background: green"
        draggable="true"
        ondragstart="onDragStart(event)"
        ondragover="onDragOver(event)"
        ondrop="onDrop(event)"
      >
        box1
      </div>
      <div
        class="box"
        style="background: orange"
        draggable="true"
        ondragstart="onDragStart(event)"
        ondragover="onDragOver(event)"
        ondrop="onDrop(event)"
      >
        box2
      </div>
      <div
        class="box"
        style="background: cyan"
        draggable="true"
        ondragstart="onDragStart(event)"
        ondragover="onDragOver(event)"
        ondrop="onDrop(event)"
      >
        box3
      </div>
    </div>
  </body>
</html>
```
