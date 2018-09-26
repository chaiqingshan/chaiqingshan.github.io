---
layout: post
section-type: post
title: "html块级元素和内联元素"
date: 2017-03-01 09:00:00 +0800 
categories: html
tag: html
---
* content
{:toc}

html块级元素和内联元素的区别...

<!-- more -->

## 1.块级元素

块级元素主要有：
h1 , h2 , h3 , h4 , h5 , h6 , p, div, ul, ol, li, form, hr, table,  address , blockquote , center , dir  , dl , fieldset , isindex , menu , noframes , noscript , pre 

块级元素(block)特性：
总是独占一行，表现为另起一行开始，而且其后的元素也必须另起一行显示;
宽度(width)、高度(height)、内边距(padding)和外边距(margin)都可控制;

## 2.内联元素

内联元素主要有：
span, a, img, input, select, textarea, label, abbr , acronym , b , bdo , big , br , cite , code , dfn , em , font , i , kbd , q , s , samp , small ,strike , strong , sub , sup , tt , u , var

内联元素(inline)特性：
和相邻的内联元素在同一行;
width和height可以看成物理属性，对内联元素没有影响。能够影响它宽高的为其本身的内容;
margin-top:10px;margin-bottom: 10px;无效果;
margin-left和margin-right;起作用;
padding-left;padding-right同样有效果,与块元素效果相同;
padding-top和padding-bottom不会影响它的高度，但是会影响他的背景高度。

## 3.可变元素

可变元素(根据上下文关系确定该元素是块元素还是内联元素)：
applet ,button ,del ,iframe , ins ,map ,object , script

**CSS中块级、内联元素的应用：**
 
利用CSS我们可以摆脱上面表格里HTML标签归类的限制，自由地在不同标签/元素上应用我们需要的属性。
主要用的CSS样式有以下三个：
display:block  -- 显示为块级元素
display:inline  -- 显示为内联元素
dipslay:inline-block--显示为内联块元素，表现为同行显示并可修改宽高内外边距等属性
我们常将<ul>元素加上display:inline-block样式，原本垂直的列表就可以水平显示了。