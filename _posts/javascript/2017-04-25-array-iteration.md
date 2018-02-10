---
layout: post
title: "js数组迭代器方法"
date: 2017-04-25 09:00:00 +0800 
categories: javascript
tag: javascript
---
* content
{:toc}


这篇文章主要总结了数组的5个使用方法，这些属性熟记于心能够给平时的编码带来意想不到的方便，有点可惜的是在IE9以下都不支持这些方法，不过在移动端和现代浏览器上则不需要考虑这些兼容，另外微信小程序也支持这种写法。

<!-- more -->

在ES5中，一共有9个Array方法：

    Array.prototype.indexOf
    Array.prototype.lastIndexOf
    Array.prototype.every
    Array.prototype.some
    Array.prototype.forEach
    Array.prototype.map
    Array.prototype.filter
    Array.prototype.reduce
    Array.prototype.reduceRight

## 1) indexOf

indexOf()方法返回在该数组中第一个找到的元素位置，如果它不存在则返回-1。

不使用indexOf时

    var arr = ['apple','orange','pear'],
        found = false;
    for(var i= 0, l = arr.length; i< l; i++){
        if(arr[i] === 'orange'){
            found = true;
        }
    }
    console.log("found:",found);

使用后

    var arr = ['apple','orange','pear'];
    console.log("found:", arr.indexOf("orange") != -1);

## 2) filter

该filter()方法创建一个新的匹配过滤条件的数组。

不用 filter() 时

    var arr = [
        {"name":"apple", "count": 2},
        {"name":"orange", "count": 5},
        {"name":"pear", "count": 3},
        {"name":"orange", "count": 16},
    ];
    var newArr = [];
    for(var i= 0, l = arr.length; i< l; i++){
        if(arr[i].name === "orange" ){
            newArr.push(arr[i]);
        }
    }
    console.log("Filter results:",newArr);

用了 filter():

    var arr = [
        {"name":"apple", "count": 2},
        {"name":"orange", "count": 5},
        {"name":"pear", "count": 3},
        {"name":"orange", "count": 16},
    ];
    var newArr = arr.filter(function(item){
        return item.name === "orange";
    });
    console.log("Filter results:",newArr);

## 3) forEach()

forEach为每个元素执行对应的方法

    var arr = [1,2,3,4,5,6,7,8];
    // Uses the usual "for" loop to iterate
    for(var i= 0, l = arr.length; i< l; i++){
        console.log(arr[i]);
    }
    console.log("========================");
    //Uses forEach to iterate
    arr.forEach(function(item,index){
        console.log(item);
    });
    forEach是用来替换for循环的

## 4) map()

map()对数组的每个元素进行一定操作（映射）后，会返回一个新的数组，

不使用map

    var oldArr = [{first_name:"Colin",last_name:"Toh"},{first_name:"Addy",last_name:"Osmani"},{first_name:"Yehuda",last_name:"Katz"}];
    function getNewArr(){
        var newArr = [];
        for(var i= 0, l = oldArr.length; i< l; i++){
        var item = oldArr[i];
        item.full_name = [item.first_name,item.last_name].join(" ");
        newArr[i] = item;
    }
    return newArr;
    }
    console.log(getNewArr());

使用map后

    var oldArr = [{first_name:"Colin",last_name:"Toh"},{first_name:"Addy",last_name:"Osmani"},{first_name:"Yehuda",last_name:"Katz"}];
    function getNewArr(){
        return oldArr.map(function(item,index){
        item.full_name = [item.first_name,item.last_name].join(" ");
        return item;
    });
    }
    console.log(getNewArr());
map()是处理服务器返回数据时是一个非常实用的函数。

## 5) reduce()

reduce()可以实现一个累加器的功能，将数组的每个值（从左到右）将其降低到一个值。

场景： 统计一个数组中有多少个不重复的单词

不使用reduce时

    var arr = ["apple","orange","apple","orange","pear","orange"];
    function getWordCnt(){
    var obj = {};
        for(var i= 0, l = arr.length; i< l; i++){
        var item = arr[i];
        obj[item] = (obj[item] +1 ) || 1;
    }
    return obj;
    }
    console.log(getWordCnt());

使用reduce()后

    var arr = ["apple","orange","apple","orange","pear","orange"];
    function getWordCnt(){
        return arr.reduce(function(prev,next){
        prev[next] = (prev[next] + 1) || 1;
        return prev;
        },{});
    }
    console.log(getWordCnt());

## 如何兼容ie浏览器

    // 模拟ES5 Array.prototype.forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(f, oThis) {
            if (!f || f.constructor != Function.toString()) return;
            oThis = oThis || window;
            for (var i = 0, len = this.length; i < len; i++) {
                f.call(oThis, this[i], i, this); //p1 上下文环境 p2 数组元素 p3 索引 p4 数组对象
            }
        }
    }

    //模拟 ES5 Array.prototype.filter
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(f, oThis) {
            if (!f || f.constructor != Function.toString()) return;
            oThis = oThis || window;
            var a = [];
            for (var i = 0, len = this.length; i < len; i++) {
                if (f.call(oThis, this[i], i, this)) a.push(this[i]);
            }
            return a;
        }
    }

    //模拟 ES5 Array.prototype.map
    if (!Array.prototype.map) {
        Array.prototype.map = function(f, oThis) {
            if (!f || f.constructor != Function.toString()) return;
            oThis = oThis || window;
            var a = [];
            for (var i = 0, len = this.length; i < len; i++) {
                a.push(f.call(oThis, this[i], i, this));
            }
            return a;
        }
    }

    //模拟 ES5 Array.prototype.every
    if (!Array.prototype.every) {
        Array.prototype.every = function(f, oThis) {
            if (!f || f.constructor != Function.toString()) return;
            oThis = oThis || window;
            for (var i = 0, len = this.length; i < len; i++) {
                if (!f.call(oThis, this[i], i, this)) return false;
            }
            return true;
        }
    }

    //模拟 ES5 Array.prototype.some
    if (!Array.prototype.some) {
        Array.prototype.some = function(f, oThis) {
            if (!f || f.constructor != Function.toString()) return;
            oThis = oThis || window;
            for (var i = 0, len = this.length; i < len; i++) {
                if (f.call(oThis, this[i], i, this)) return true;
            }
            return false;
        }
    }

    //模拟 ES5 Array.prototype.indexOf方法.并修复ff等其他实现indexOf方法的浏览器中值类型于引用类型比较相等性一律返回false问题
    Array.prototype.indexOf = function(obj) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (compare(this[i], obj)) return i;
        }
        return -1;
    }

    //模拟 ES5 Array.prototype.lastIndexOf方法.并修复ff等其他实现indexOf方法的浏览器中值类型于引用类型比较相等性一律返回false问题
    Array.prototype.lastIndexOf = function(obj) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (compare(this[i], obj)) return i;
        }
        return -1;
    }
