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
1. Purely javascript project. Nodejs as backend. JQuery + Bootstrap as front end.
2. Service using nodejs + mysql.
3. Heavy server light browser design. Most of the data handle/render happens in server side. (Which I believe is the future)
4. Data exchange all in json format, only render into html when it needs to be drawed. 
5. Using LeanCloud as user register/manage solution - it's just a simple way, you can always switch to your prefered mechanism.
6. Using qiniu as image storage service provider, you may switch to any cloud storage service you prefer.
7. Some spider features are using casperjs as engine. 




