# 浏览器工作原理

## 浏览器的组成

- 渲染引擎
- JS 解释器
- 网络模块

## HTML 的解析过程

1. 下载 HTML
2. 解析 HTML（构建 DOM 树）
3. 下载 CSS
4. 解析 CSS
5. 下载 JS（阻塞 HTML 解析）
6. 执行 JS（阻塞 HTML 解析）

- JS 的下载和执行会阻塞 HTML 的解析，原因是：
  **JS 的执行可能会改变 DOM 树**

- CSS 的下载和执行会阻塞 JS 的执行，原因是：
  **JS 需要 CSS 执行的结果**

## Script 标签的 defer 和 async

- defer 让 Script 下载和执行同时执行，然后再触发 DOM Ready 事件，保证先后顺序。
- async 让 Script 的执行和下载与 DOM Ready 事件完全没有关系，不保证先后顺序。

![Script defer vs async](https://res.cloudinary.com/josefzacek/image/upload/v1520507339/blog/whats-the-difference-between-async-vs-defer-attributes.jpg)

## 页面渲染原理

1. 合成渲染树：DOM Tree + CSS Tree = Render Tree
2. 布局（Layout）：大小、布局方式
3. 绘制（Paint）：颜色、阴影
4. 合成（Composite）：层次

- reflow：重新布局（性能消耗大）
- repaint：重新绘制

查询哪些属性会 reflow / repaint：[CSS Triggers](https://csstriggers.com/)

> CSS 优化技巧：transform 不会触发 reflow 和 repaint
