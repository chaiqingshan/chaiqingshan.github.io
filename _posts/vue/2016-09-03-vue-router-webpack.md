---
layout: post
title: "Vue.js结合vue-router和webpack编写单页路由项目"
date: 2016-09-03 09:00:00 +0800 
categories: vue
tag: vue
---
* content
{:toc}

Vue.js结合vue-router和webpack编写单页路由项目
:smile::grin::grinning:

<!-- more -->

## 一、前提

*1. 安装了Node.js。*

*2. 安装了npm。*

*3. 检查是否安装成功：*

打开cmd，输入node，没有报“node不是内部或外部命令”表示安装成功node.js。
打开cmd，输入npm，没有报“npm不是内部或外部命令”表示安装成功node.js。

*4.　node.js下载地址：http://pan.baidu.com/s/1eRW4hiU。用这个安装包安装会默认帮你安装npm*

注意：由于webpack是一个基于node的项目，所以必须安装node.js和npm

##　二、创建项目目录

*1.在C盘目录下面创建文件夹：firstvue（注意不能有大写字母）。然后打开cmd，进入firstvue目录。*

<img src="http://ohm1mniu1.bkt.clouddn.com/1" alt="" width="60%">

可见当前是一个空目录。


*2. 新建文件，改名为package.json。然后输入如下内容，再执行命令：npm install。*

        {  
            "name": "firstvue",   
            "version": "1.0.0",  
            "description": "vue+webapck",   
            "main": "index.js",   
            "scripts": {  
                "test": "echo \"Error: no test specified\" && exit 1",  
                "start": "webpack-dev-server --inline"  
            },   
            "dependencies": {   
                "vue": "^1.0.18",  
                "vue-router": "^0.7.13"  
            },  
            "devDependencies": {   
                "autoprefixer-loader": "^2.0.0",  
                "babel": "^6.3.13",  
                "babel-core": "^6.3.21",  
                "babel-loader": "^6.2.0",  
                "babel-plugin-transform-runtime": "^6.3.13",  
                "babel-preset-es2015": "^6.3.13",  
                "babel-runtime": "^5.8.34",  
                "css-loader": "^0.16.0",  
                "file-loader": "^0.8.5",  
                "html-loader": "^0.3.0",  
                "node-sass": "^3.4.2",  
                "sass-loader": "^3.2.0",  
                "style-loader": "^0.12.3",  
                "url-loader": "^0.5.6",  
                "vue-html-loader": "^1.2.0",  
                "vue-loader": "^7.2.0",  
                "webpack": "^1.12.0",  
                "webpack-dev-server": "^1.14.0"  
            },  
            "author": "xiaoming",   
            "license": "MIT",   
            "keywords": [  
                "vue",  
                "webpack"  
            ]  
        }  

<img src="http://ohm1mniu1.bkt.clouddn.com/2" alt="" width="60%">

您唯一需要修改的是项目name和作者author。
安装成功可以看到当前目录结构如下：（其中node_modules是自动生成的）

<img src="http://ohm1mniu1.bkt.clouddn.com/3" alt="" width="60%">

*3.新建文件，改名为：webpack.config.js。这个是我们的webpack配置文件，输入内容：*

        var path = require('path');  
        // NodeJS中的Path对象，用于处理目录的对象，提高开发效率。  
        // 模块导入  
        module.exports = {  
            // 入口文件地址，不需要写完，会自动查找  
            entry: './src/main',  
            // 输出  
            output: {  
                path: path.join(__dirname, './dist'),  
                // 文件地址，使用绝对路径形式  
                filename: '[name].js',  
                //[name]这里是webpack提供的根据路口文件自动生成的名字  
                publicPath: '/dist/'  
                // 公共文件生成的地址  
            },  
            // 服务器配置相关，自动刷新!  
            devServer: {  
                historyApiFallback: true,  
                hot: false,  
                inline: true,  
                grogress: true,  
            },  
            // 加载器  
            module: {  
                // 加载器  
                loaders: [  
                // 解析.vue文件  
                    { test: /\.vue$/, loader: 'vue' },  
                // 转化ES6的语法  
                    { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },  
                // 编译css并自动添加css前缀  
                    { test: /\.css$/, loader: 'style!css!autoprefixer'},  
                //.scss 文件想要编译，scss就需要这些东西！来编译处理  
                //install css-loader style-loader sass-loader node-sass --save-dev  
                    { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},  
                // 图片转化，小于8K自动转化为base64的编码  
                    { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},  
                //html模板编译？  
                    { test: /\.(html|tpl)$/, loader: 'html-loader' },  
                ]  
            },  
            // .vue的配置。需要单独出来配置，其实没什么必要--因为我删了也没保错，不过这里就留这把，因为官网文档里是可以有单独的配置的。  
            vue: {  
                loaders: {  
                    css: 'style!css!autoprefixer',  
                }  
            },  
            // 转化成es5的语法  
            babel: {  
                presets: ['es2015'],  
                plugins: ['transform-runtime']  
            },  
            resolve: {  
                // require时省略的扩展名，如：require('module') 不需要module.js  
                extensions: ['', '.js', '.vue'],  
                // 别名，可以直接使用别名来代表设定的路径以及其他  
                alias: {  
                    filter: path.join(__dirname, './src/filters'),  
                    components: path.join(__dirname, './src/components')  
                }  
            },  
            // 开启source-map，webpack有多种source-map，在官网文档可以查到  
            devtool: 'eval-source-map'  
        };  

您只需要复制上面内容即可，不要修改任何文件。此时项目目录如下：

<img src="http://ohm1mniu1.bkt.clouddn.com/4" alt="" width="60%">

*4. 新建文件，改名为：index.html。输入如下内容：*

        <!DOCTYPE html>  
        <html lang="en">  
        <head>  
            <meta charset="UTF-8">  
            <title>webpack vue</title>  
        </head>  
        <body>  
            <div id="app">  
                 <h1>Hello App!</h1>  
                  <p>  
                    <a v-link="{ path: '/login' }">登录界面 </a>  
                    <a v-link="{ path: '/register' }">注册界面</a>  
                  </p>  
                  <router-view></router-view>  
            </div>  
            <script src="dist/main.js"></script>  
        </body>  
        </html>  


*5. 新建一个空目录，改名为：dist。不用管它。项目会自动引用*

*6. 新建一个目录，改名为：src。然后在src目录下新建一个文件，改名为：main.js。内容如下：*

        import Vue from "vue";  
        import VueRouter from "vue-router";  
        Vue.use(VueRouter);  
          

        var App = Vue.extend({})  
        var router = new VueRouter()  
        router.map({  
            '/login': {  
                component: function (resolve) {  
                  require(['./components/login.vue'], resolve)  
                }  
            },  
            '/register': {  
                component: function (resolve) {  
                  require(['./components/register.vue'], resolve)  
                }  
            }  
              
        })  
          
        router.start(App, '#app')  


*7. 在src文件夹下建立目录，改名为：components。然后进入components，新建文件：login.vue和register.vue。内容如下：*

        login.vue
        [html] view plain copy 在CODE上查看代码片派生到我的代码片
        <template>  
          <div class="head">  
            <input type = "text" value = "{{ title }}"></input>  
            <input type = "submit" v-on:click="golist()" ></input>  
          </div>  
        </template>  
          
        <script type="text/javascript">  
          export default {  
              data() {  
                return {  
                  title: "这是登录界面"  
                }  
              },  
              methods :{  
                  golist () {//方法，定义路由跳转，注意这里必须使用this，不然报错  
                      this.$route.router.go({path:"/register"});  
                  }  
              }  
          }  
        </script>  

        register.vue
        [html] view plain copy 在CODE上查看代码片派生到我的代码片
        <template>  
          <div class="head">  
            <h1>{{ title }}</h1>  
          </div>  
        </template>  
          
        <script type="text/javascript">  
          export default {  
            data() {  
              return {  
                title: "这里是注册界面"  
              }  
            }  
          }  
        </script>  

此时目录结构如下图：

<img src="http://ohm1mniu1.bkt.clouddn.com/5" alt="" width="60%">

<img src="http://ohm1mniu1.bkt.clouddn.com/6" alt="" width="60%">

至此，目录结构创建完毕。

## 三、运行npm start

*1. 只要运行npm start，运行成功就大功告成了。如图：*

<img src="http://ohm1mniu1.bkt.clouddn.com/7" alt="" width="60%">

*2. 成功的话会出现下图：*

<img src="http://ohm1mniu1.bkt.clouddn.com/8" alt="" width="60%">

*3. 打开浏览器，输入：http://127.0.0.1:8080，即可看到如下图：*

<img src="http://ohm1mniu1.bkt.clouddn.com/9" alt="" width="60%">

点击登录会出现如下图：

<img src="http://ohm1mniu1.bkt.clouddn.com/10" alt="" width="60%">


## 四、注意

1. 如果端口8080被占用，npm start的时候会报错的，这个时候只要把占用8080端口的进程关闭即可。您也可以修改端口，输入：webpack-dev-server --port 9090。即可修改端口号

2. vue参考资料：http://cn.vuejs.org/guide/syntax.html

3. 我的项目资源地址：https://github.com/chaiqingshan/firstvue
