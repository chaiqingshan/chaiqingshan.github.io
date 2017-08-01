---
layout: post
section-type: post
title: "sticky footer实现方案小结"
date: 2017-08-01 09:00:00 +0800 
categories: css
tag: css
---
* content
{:toc}

做前端开发经常会遇到过这样尴尬的排版问题：
在主体内容不足够多或者未完全加载出来之前，因为没有足够的垂直空间使得页脚推到浏览器窗口最底部。但是，我们期望的效果是页脚应该一直处于页面最底部。

<!-- more -->

## 什么是 “Sticky Footer”

所谓 “Sticky Footer”，并不是什么新的前端概念和技术，它指的就是一种网页效果：
如果页面内容不足够长时，页脚固定在浏览器窗口的底部；如果内容足够长时，页脚固定在页面的最底部。总而言之，就是页脚一直处于最底部。

假设我们页面的 HTML 结构是这样：

```html
    <div class="wrapper">
        <div class="content"><!-- 页面主体内容区域 --></div>
        <div class="footer"><!-- 需要做到 Sticky Footer 效果的页脚 --></div>
    </div>
```

## 实现方案一：absolute

通过绝对定位处理应该是常见的方案，只要使得页脚一直定位在主容器预留占位位置。

```CSS
    html, body {
        height: 100%;
    }
    .wrapper {
        position: relative;
        min-height: 100%;
        padding-bottom: 50px;
        box-sizing: border-box;
    }
    .footer {
        position: absolute;
        bottom: 0;
        height: 50px;
    }
```

这个方案需指定 html、body 100% 的高度，且 content 的 padding-bottom 需要与 footer 的 height 一致。

## 实现方案二：calc

通过计算函数 calc 计算（视窗高度 - 页脚高度）赋予内容区最小高度，不需要任何额外样式处理，代码量最少、最简单。

```CSS
    .content {
        min-height: calc(100vh - 50px);
    }
    .footer {
        height: 50px;
    }
```

如果不需考虑 calc() 以及 vh 单位的兼容情况，这是个很理想的实现方案。
同样的问题是 footer 的高度值需要与 content 其中的计算值一致。

## 实现方案三：Flexbox

Flexbox 是非常适合实现这种效果的，使用 Flexbox 实现不仅不需要任何额外的元素，而且允许页脚的高度是可变的。

虽然大多数 Flexbox 布局常用于水平方向布局，但别忘了实际上它也可用于垂直布局，所以你需要做的是将垂直部分包装在一个 Flex 容器中，并选择要扩展的部分，他们将自动占用其容器中的所有可用空间。

```CSS
    html {
        height: 100%;
    }
    body {
        min-height: 100%;
        display: flex;
        flex-direction: column;
    }
    .content {
        flex: 1;
    }
```

需要注意的是想要兼容各种系统设备，需要兼顾 flex 的兼容写法。
