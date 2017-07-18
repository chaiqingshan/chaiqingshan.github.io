---
layout: post
section-type: post
title: js区分object和array的6种方法
category: 技术
tags: [ 'js' ]
---
一、经常遇见的问题：

js中判断一个对象的类型时，通常使用typeof，这时候问题就来了，因为typeof()辨别数组的时候返回的是object,所以JS中判断一个对象是不是数组需要一些特殊的处理方式，下面将介绍个人总结的六种处理方法。

二、开门见山
开发中要判断一个对象是不是数组，推荐使用下面这个函数：

    function isArray(obj){  
        if(Array.isArray){  
            return Array.isArray(obj);  
        }else{  
         return Object.prototype.toString.call(obj)==="[object Array]";  
        }  
    }  

上面这个函数是方便急于解决问题的人，下面将具体述说六种方法。

三、六种方案详解：

（1）方法一：利用toString方法

通过调用toString( )方法试着将该变量转化为代表其类型的string。该方法对于真正的array可行；参数对象转化为string时返回[object Arguments]会转化失败；此外，对于含有数字长度属性的object类也会转化失败。 

方法如下：

    <!DOCTYPE html>  
    <html>  
     <head>  
      <title>Array的判断方法</title>  
      <meta charset="utf-8"/>  
      <script>  
        function isArrayOne(arr){  
            return <span style="color:#cc0000;">Object.prototype.toString.call(arr) === "[object Array]";</span>  
        }  
        var obj = {"k1":"v1"};  
        var arr = [1,2];  
        console.log("对象的结果："+isArrayOne(obj));  //false
        console.log("数组的结果："+isArrayOne(arr));  //true
      </script>  
     </head>  
     <body>  
        
     </body>  
    </html>  


注意：推荐使用“===”全等于而不使用“==”等等于，因为效率更高！

（2）方法二：通过isArray：

使用JavaScript 1.8.5（ECMAScript 5），变量名字.isArray()可以实现这个目的，前提是有支持这一函数，其实isArray就是方法一的封装使用。
使用方法十分简单：

    Array.isArray(obj);   //obj是待检测的对象  

返回true或false，如果为true则为数组

（3）方法三：通过instanceof运算符来判断，

注意：instanceof运算符左边是子对象（待测对象），右边是父构造函数（这里是Array），即：子对象 instanceof  父构造函数 
instance: 实例：凡是用new 构造函数()创建出的对象，都称为是构造函数的实例 

    <!doctype html>  
    <html lang="en">  
     <head>  
      <meta charset="UTF-8">  
      <meta name="Generator" content="EditPlus®">  
      <meta name="Author" content="">  
      <meta name="Keywords" content="">  
      <meta name="Description" content="">  
      <title>Document</title>  
      <script>  
        var obj = {"k1":"v1"};  
        var arr = [1,2];  
        console.log("Instanceof处理对象的结果："+(obj instanceof Array)); //fasle 
        console.log("Instanceof处理数组的结果："+(arr instanceof Array)); //true
      </script>  
     </head>  
     <body>  
        
     </body>  
    </html>  

（4）使用isPrototypeOf()函数

原理：检测一个对象是否是Array的原型（或处于原型链中，不但可检测直接父对象，还可检测整个原型链上的所有父对象）

使用方法: parent.isPrototypeOf(child)来检测parent是否为child的原型;

需注意的是isPrototypeOf()函数实现的功能和instancof运算符非常类似；

    Array.prototype.isPrototypeOf(arr) //true表示是数组，false不是数组  

（5）利用构造函数constructor

具体代码：

    <!doctype html>  
    <html lang="en">  
     <head>  
      <meta charset="UTF-8">  
      <meta name="Generator" content="EditPlus®">  
      <meta name="Author" content="">  
      <meta name="Keywords" content="">  
      <meta name="Description" content="">  
      <title>Document</title>  
      <script>  
        var obj = {'k':'v'};  
        var t1 = new Array(1);  
        var t2 = t1;  
        console.log(obj.constructor == Array);  //false
        console.log(t1.constructor == Array); //true 
        console.log(t2.constructor == Array); //true 
      </script>  
     </head>  
     <body>  
          
     </body>  
    </html>  

（6）使用typeof(对象)+类型名结合判断：

代码如下：

    <!doctype html>  
    <html lang="en">  
     <head>  
      <meta charset="UTF-8">  
      <meta name="Generator" content="EditPlus®">  
      <meta name="Author" content="">  
      <meta name="Keywords" content="">  
      <meta name="Description" content="">  
      <title>Document</title>  
      <script>  
        function isArrayFour(arr){  
            if(typeof(arr)==="object"){  
                if(arr.concat){  
                    return "This is Array";  
                }else{  
                    return "This Not Array";  
                }  
            }  
        }  
        var arr = [1];  
        var obj = {'k':'v'};  
        console.log(typeof(arr));  //object
        console.log(typeof(obj));  //object
        console.log(isArrayFour(arr));  //this is array
        console.log(isArrayFour(obj));  //this is not array
      </script>  
     </head>  
     <body>  
        
     </body>  
    </html>  

这种方法其实有局限性，有的同学可能一下就破解了，那就是要是
要是对象中不巧定义了这属性怎么办
var obj = {'concat':'Teast me?'};
