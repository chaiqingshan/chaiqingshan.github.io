---
layout: post
section-type: post
title: "ApiCloud笔记总结"
date: 2017-08-08 09:00:00 +0800 
categories: ApiCloud
tag: ApiCloud
---
* content
{:toc}

ApiCloud笔记总结

<!-- more -->

## 屏幕适配

要正确设置viewport，建议使用720*1280尺寸的UI图，优先考虑绝对计量类的单位 px，应先在UI效果图中（如720x1280尺寸图）量出元素的宽或高对应的 px 值，再除以屏幕倍率（如分辨率为720x1280设备的屏幕倍率通常为 2) 来得到书写样式时的确切数值。

## 窗口关闭处理

开发过程中根据需要处理Android的keyback事件和iOS的回滑手势。

Android上要在Window中才能监听到keyback事件，Frame中无法监听到keyback事件；

在iOS7以上的系统上可以在openWin的时候通过设置slidBackEnabled参数来实现是否支持回滑手势关闭窗口的功能。

在后台关闭页面时，应注意在关闭方法中添加animation:{type:"none"}，来防止切换动画的出现影响用户体验。

##  界面之间参数传递

使用pageParam来实现，但要避免使用过大的pageParam。 

界面切换的时候如果pageParam过大，则JSON解析就会比较耗时，影响界面切换的执行和动画运行体验。

不能使用URL+?的形式进行参数的传递，此方式在Android上存在兼容问题。

## 交互响应

点击事件必须处理click事件的300ms延迟问题，优化点击响应速度，通过为可点击的元素增加tapmode属性来优化点击速度。

引擎对具有tapmode属性的元素点击事件的优化处理会在apiready事件触发之前，根据当前的dom树自动进行优化。在apiready之后加载的数据使用要显式的调用api.parseTapmode方法来进行主动的tapmode处理，例如在上拉加载更多数据后，要调用一下api.parseTapmode方法.

要按照需求明确所有按钮点击时的交互效果，为tapmode属性设置正确的样式值，对于没有交互效果的点击实现，可以不为tapmode属性指定任何样式，但是为了优化点击速度，必须要给元素增加tapmode属性。

## 网络通信方式

必须使用api.ajax，并且设置合适的超时时间，并进行超时和请求失败的异常情况。JQuery的ajax在开启全包加密的时候会有问题。

## 数据缓存

要对GET请求进行数据的缓存处理，在用户没用网络的情况下，仍然能够看到APP的静态界面布局以及上次已经缓存的服务器端数据。

可以在api.ajax方法中设置cache参数为true来开启缓存；也可以使用api.writeFile和api.readFile方法，在获取数据后自己实现简单的数据缓存，或使用fs和db模块来缓存数据。

## 图片缓存

必须手动进行图片的缓存处理，需要调用api.imageCache方法实现。

Webview默认的缓存机制存在缺陷，在跨窗口时表现不好，并且存在对所缓存图片的尺寸限制等问题，所有APICloud应用的图片缓存不能依赖Webview默认的缓存机制，必须手动实现。

## 状态栏效果

Android和iOS上都要求实现沉浸式状态栏效果的适配

可以通过在config.xml中开启沉浸式效果配置项，然后在Window或Frame的apiready事件后，调用$api.fixStatusBar()方法来实现。如果由于各种原因造成apiready执行太晚，当Header高度变化时会产生页面跳动的现象，也可以根据需求自己来实现，在合适的时机（如onload事件中）判断平台类型后，手动调整Header的高度，Android的状态栏高度是25px，iOS是20px。

根据当前界面的背景颜色，通过调用api.setStatusBarStyle方法来设置当前状态栏的风格或背景色。

## 键盘处理

在打开带有输入框的Window或Frame的是，默认要自动让输入框自动获得焦点。
在config.xml中有关于键盘显示方式，弹出方式和第三方键盘使用的各种配置，要根据需要正确配置。

由于在Android上input元素的focus事件存在兼容性问题，要完成输入框自动获取焦点的功能，可使用扩展模块UIInput模块。

在打开Window的时候，如果自动弹出键盘，弹出键盘的行为影响切换动画执行的流畅性，出现卡顿或丢帧的情况。可以对键盘弹出的行为设置适当的延迟，例如在apiready中设置延迟200ms后再让UIInut元素获得焦点。

可以在同一个界面中（如登陆界面）创建多个UIInput模块的实例，来实现多个输入框。
输入框位于设备屏幕下半部份的应用场景，config.xml中的的键盘弹出模式参数softInputMode务必设置为resize模式，或者使用UIInput相关模块。

为了让应用看起来更接近原生，尽量配置config.xml中的softInputBarEnabled参数来隐藏iOS键盘上面的工具条。也可以在openWin或openFrame的时候通过softInputBarEnabled参数来单独指定。