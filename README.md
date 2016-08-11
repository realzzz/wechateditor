# wechateditor
An html editor for articles of wechat

An online(production) site is the best explaination of this project, visit [DWEDITOR](http://www.dweditor.com) to try it.


-----

### Features about this project:
1. This is a online html editor for articles, mainly for articles of wechat.
2. You can create your articles and insert different elements/templates into it, all in html format. 
3. You can also copy/paste other html section from the browser into article, then modify the content you brought in.
4. It supports to import wechat article directly into editor, as your article. 
5. Every operation is tracable, supports undo/redo for all the steps you've done editing the article. 
6. Support to insert snapshot from link of Taobao, Tmall, weibo.


### Tech introduction
1. Purely javascript project. Nodejs(Express) as backend. JQuery + Bootstrap as front end.
2. Service using nodejs + mysql.
3. Heavy server light browser design. Most of the data handle/render happens in server side. (Which I believe is the future)
4. Data exchange all in json format, only render into html when it needs to be drawn. 
5. Using LeanCloud as user register/manage solution - it's just a simple way, you can always switch to your prefered mechanism.
6. Using qiniu as image storage service provider, you may switch to any cloud storage service you prefer.
7. Some spider features are using casperjs as engine. 


### How to start
1. Get mysql env ready. Run [Mysql tables initialize scripts](enahncedmd/util/mysql.txt)
2. (Optional) Import templates into mysql using [Templates data scripts](enhancedmd/util/templte.sql)
3. Set up your mysql env at [env.json](enhancedmd/util/env.json) for mysql host,port,user,pwd,db. 
4. (Optional - if you want to store image) Set up your qiniu account at [env.json](enhancedmd/util/env.json) for qiniu bucket, url, accesskey, secret
5. (Optional - if you want to have user system) Set up LeanCloud apikey&secret at [boot.js line18](enhancedmd/public/js/KCEPROD/boot/boot.js)
6. Run npm install under enhancedmd to get all the dependency packages ready.
7. Start server under enhancedmd  (recommand way -  for development : `supervisor bin/www`   for debug  : `node-debug bin/www` ) . Visit [localhost](http://localhost:3000)

### Check out desgins & code guidence at this [Doc](Docs/design.md)

### About this project
This is our company's project from scratch since Feb/2016, the development last for about three months.
I've designed the whole architecture and implement majority of the code.  

Other two engineers who involved in this project:
+ [Vaninadh](https://github.com/mindyue) UI framework designer, main developer for editor UI. 
+ [Xuyitao](https://github.com/xuyitao) Web spider expert, everything related to spider is his contribution.


