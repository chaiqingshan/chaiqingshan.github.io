---
layout: post
title: "实现浏览器内多个标签页之间的通信"
date: 2017-02-05 09:00:00 +0800 
categories: javascript
tag: javascript
---
* content
{:toc}

调用localstorage、cookies等本地存储方式实现浏览内多个标签页之间的通信。

<!-- more -->

## 方法一：

localstorage在一个标签页里被添加、修改或删除时，都会触发一个storage事件，通过在另一个标签页里监听storage事件，即可得到localstorage存储的值，实现不同标签页之间的通信。

标签页1：
        
        <input type="text" name="" id="name">
        <input type="button" name="" id="btn" value="提交">
        <script type="text/javascript">
            $(function(){
                $('#btn').click(function(){
                    var name=$('#name').val();
                    localStorage.setItem("name",name);
                });
            });
        </script>

标签页2：

        <script type="text/javascript">
            $(function(){
                window.addEventListener("storage",function(event){
                    console.log(event.key+"="+event.newValue);
                });
            });
        </script>

## 方法二：

使用cookie+setInterval，将要传递的信息存储在cookie中，每隔一定时间读取cookie信息，即可随时获取要传递的信息。

标签页1：

        <input type="text" name="" id="name">
        <input type="button" name="" id="btn" value="提交">
        <script type="text/javascript">
            $(function(){
                $("#btn").click(function(){
                    var name=$("#name").val();
                    document.cookie="name="+name;
                });
            });
        </script>

标签页2：

        <script type="text/javascript">
            $(function(){
                function getCookie(key){
                    return JSON.parse("{\"" + document.cookie.replace(/;\s+/gim,"\",\"").replace(/=/gim, "\":\"") + "\"}")[key];
                }
                setInterval(function(key){
                    console.log("name="+getCookie("name"));
                },10000);
            });
        </script>
