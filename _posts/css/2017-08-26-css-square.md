---
layout: post
section-type: post
title: "css实现自适应正方形"
date: 2017-08-26 09:00:00 +0800 
categories: css
tag: css
---
* content
{:toc}

首先，自适应正方形是指宽度和高度随着屏幕宽度（不管是移动端还是PC端）进行等比例变化的正方形，在处理移动端页面时，我们有时会需要将banner图做成与屏幕等宽的正方形以获得最佳的体验效果，而在PC端，我们也可能需要实现一个随屏幕宽度变化的正方形，从而达到某些效果；那么应该怎么使用纯CSS制作出能够自适应大小的正方形呢？

<!-- more -->

## 方案一：CSS3 vw 单位

CSS3 中新增了一组相对于可视区域百分比的长度单位 vw, vh, vmin, vmax。其中vw是相对于视口宽度百分比的单位，1vw = 1% viewport width，vh是相对于视口高度百分比的单位，1vh = 1% viewport height；vmin是相对当前视口宽高中较小的一个的百分比单位，同理vmax是相对当前视口宽高中 较大 的一个的百分比单位。

代码实现

```html
<div class="placeholder"></div>

.placeholder{
  width:50vw;
  height:50vw;
}
```

优点：简洁方便

缺点：浏览器兼容不好

## 方法二：设置垂直方向的padding撑开容器

在 CSS 盒模型中，一个比较容易被忽略的就是 margin, padding 的百分比数值计算。按照规定，margin, padding 的百分比数值是相对父元素宽度的宽度计算的。由此可以发现只需将元素垂直方向的一个 padding 值设定为与 width 相同的百分比就可以制作出自适应正方形了：

代码实现

```CSS 
.placeholder{
  width:100%;
  padding:bottom:100%;
}
```

如果正方形中没有内容（相当于只是一个几何里面的正方形，并没有展示其他任何内容），一切看起来都很正常；但是，如果正方形中有其他内容（这种情况会更常见一些，比如说有一些文本和图片），此时容器的高度就会被拉伸，因为盒子模型中的padding是不包含在content中的，所以我们可以通过height:0解决这个问题；这种方案简洁明了，且兼容性好；但是除了填充内容后会出现问题以外，还有可能碰上max-height不收缩，于是第三种方案来了：

## 方案三：利用伪元素的margin(padding)-top撑开容器

在方案二中，我们利用百分比数值的 padding-bottom 属性撑开容器内部空间，但是这样做会导致在元素上设置的 max-height 属性失效：

而失效的原因是max-height 属性只限制于 height，也就是只会对元素的 content height 起作用。那么我们是不是能用一个子元素撑开 content 部分的高度，从而使 max-height 属性生效呢？我们来试试：

```CSS
.placeholder {
  width: 100%;
}
.placeholder:after {
  content: '';
  display: block;
  margin-top: 100%; /* margin 百分比相对父元素宽度计算 */
}
```

一刷新页面，怎么什么也没有？

这里就涉及到margin collapse的概念了，由于容器与伪元素在垂直方向发生了外边距折叠，所以我们想象中的撑开父元素高度并没有出现。而应对的方法是在父元素上触发 BFC：

触发BFC CSS

```CSS
.placeholder {
  overflow: hidden;
}
```

## 总结

以上就是三种制作自适应正方形的方案，除去 CSS3 中的视口相对单位，主要利用到 margin, padding 的百分比数值相对父元素宽度的宽度计算得出来制作宽高相等、且相对视口宽度自适应的正方形。如果需求是制作相对视口高度自适应的正方形，估计就只能使用 vh 单位了吧~