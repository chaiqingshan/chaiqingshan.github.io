---
layout: post
title: "sessionstorage、localstorage和cookie笔记总结"
date: 2017-02-18 09:00:00 +0800 
categories: javascript
tag: javascript
---
* content
{:toc}

sessionstorage、localstorage和cookie笔记总结

<!-- more -->

## 1.存储方式不同
cookie数据始终在同源的http请求中携带（即使不需要），即cookie在浏览器和服务器间来回传递。而sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。cookie数据还有路径（path）的概念，可以限制cookie只属于某个路径下。

## 2.存储大小限制不同
cookie数据不能超过4k，同时因为每次http请求都会携带cookie，所以cookie只适合保存很小的数据，如会话标识。sessionStorage和localStorage虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。

## 3.数据有效期不同
sessionStorage：仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持；
localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；
cookie只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。

## 4.作用域不同
sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；
localStorage在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的。

控制台查看cookie:alert(document.cookie)

localStorage 是以key-value形式保存数据的，key和value只能是字符串格式。因此数字1保存后，会转换成字符串1。
如果要在localStorage或者sessionStorage中保存数字，那就得用json的数据形式来保存
例如下面示例代码

    var obj = {};
    obj[getData.value] = getData.value;
    obj['Number'] = 1;
    window.sessionStorage[getData.value] = JSON.stringify(obj);

本质就是使用使用JSON.stringify和 JSON.parse封装数据

Demo

    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <style>
    textarea{
        width: 300px;
        height: 300px;
    }
    </style>
    <body>
        <textarea id="textarea"></textarea>
        <label>输入</label>
        <input type="text" id="getData" />
        <button>session存储数据</button>
        <button>session读取数据</button>
        <button>session清除数据</button>
        <button>local存储数据</button>
        <button>local读取数据</button>
        <button>local清除数据</button>
    </body>
    <script>
        window.onload = function(){
            function $(str) {
                var type = str.substr(0,1);
                var select = str.substr(1,str.length);
                if(type=='#'){
                    return document.getElementById(select);
                }
                //console.log(document.getElementById(id));
            }
            $('#textarea');
            console.log($('#textarea'));
            var textArea = document.getElementById("textarea");
            var getData = document.getElementById("getData");
            var buttonArr = document.getElementsByTagName("button");
            //session存储数据
            buttonArr[0].onclick = function(){
                window.sessionStorage[getData.value] = getData.value;
                var obj = {};
                obj[getData.value] = getData.value;
                obj['Number'] = 1;
                window.sessionStorage[getData.value] = JSON.stringify(obj);
                //window.sessionStorage.setItem(getData.value, JSON.stringify(obj))
                textArea.value+=("sessionStorage保存"+getData.value+":"+getData.value+"\n");
            }

            //session读取数据
            buttonArr[1].onclick = function(){
                var info = window.sessionStorage[getData.value]?window.sessionStorage[getData.value]:"不存在";
                textArea.value+=("sessionStorage读取"+getData.value+":"+info+"\n");
            }

            //session清除数据
            buttonArr[2].onclick = function(){
                var info = window.sessionStorage[getData.value]?
                window.sessionStorage[getData.value]:"不存在";
                window.sessionStorage[getData.value]?
                window.sessionStorage.removeItem(getData.value):"不存在";
                textArea.value+=("sessionStorage清楚"+getData.value+":"+info+"\n");
            }

            //local存储数据
            buttonArr[3].onclick = function(){
                window.localStorage[getData.value] = getData.value;
                textArea.value+=("localStorage保存"+getData.value+":"+getData.value+"\n");
            }

            //local读取数据
            buttonArr[4].onclick = function(){
                var info = window.localStorage[getData.value]?window.localStorage[getData.value]:"不存在";
                textArea.value+=("localStorage读取"+getData.value+":"+info+"\n");
            }

            //local清除数据
            buttonArr[5].onclick = function(){
                var info = window.localStorage[getData.value]?
                window.localStorage[getData.value]:"不存在";
                window.localStorage[getData.value]?
                window.localStorage.removeItem(getData.value):"不存在";
                textArea.value+=("sessionStorage清楚"+getData.value+":"+info+"\n");
            }
        }
    </script>
