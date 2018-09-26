---
layout: post
title: "移动端实现1px边框"
date: 2017-05-07 09:00:00 +0800 
categories: css
tag: css
---
* content
{:toc}

由于分辨率DPI的差异，高清手机屏上的1px实际上是由2×2个像素点来渲染，有的屏幕甚至用到了 3×3 个像素点, 所以 border: 1px 在移动端会渲染为 2px 的边框

最简单的解决办法，就是用图片做边框，只是修改颜色不太方便。除此之外，还有两种常用的办法

<!-- more -->

## transform:scale

使用伪类 :after 或者 :before 创建 1px的边框，然后通过media适配不同的设备像素比，然后调整缩放比例，从而实现一像素边框

首先用伪类创建边框

    .border-bottom{
        position: relative;
        border-top: none !important;
    }
    
    .border-bottom::after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #e4e4e4;
        -webkit-transform-origin: left bottom;
        transform-origin: left bottom;
    }
 

然后通过媒体查询来适配

    /* 2倍屏 */
    @media only screen and (-webkit-min-device-pixel-ratio: 2.0) {
        .border-bottom::after {
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }
    }

    /* 3倍屏 */
    @media only screen and (-webkit-min-device-pixel-ratio: 3.0) {
        .border-bottom::after {
            -webkit-transform: scaleY(0.33);
            transform: scaleY(0.33);
        }
    }

 这种办法的边框并不是真正的 border，而是高度或者宽度为1px的块状模型，所以这种办法不能做出圆角，一般都用来画分割线。

##　viewport

网页的内容都渲染在 viewport 上，所以设备像素比的差异，直接影响的也是 viewport 的大小

通过 js 获取到设备像素比，然后动态添加 <meta> 标签

    <script type="text/javascript">
       (function() {
           var scale = 1.0;
           if (window.devicePixelRatio === 2) {
               scale *= 0.5;
           }
           if (window.devicePixelRatio === 3) {
               scale *= 0.333333;
           }
           var text = '<meta name="viewport" content="initial-scale=' + scale + ', maximum-scale=' + scale +', minimum-scale=' + scale + ', width=device-width, user-scalable=no" />';
           document.write(text);       
        })();
    </script>
