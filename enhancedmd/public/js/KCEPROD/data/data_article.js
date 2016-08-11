define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require('../util/util');
    return defineComponent(dataArticle);

    function dataArticle() {
        this.attributes({

        });

        this.dataCreateArticle = function(e, data) {
            var uid = util.getGlobalVar(window.kc.ns.k.current_user_id);

            var attrObj = {};
            attrObj = data.para;
            var item = $(data.el);
            //var kcpath = util.constructKcPath(item.context);
            //var parentItem = item;
            //parentItem = util.findParentContainer(item);

            var responseEvent = data.respEvent;
            var thisRef = this;

            this.articlefunc("createArticle", "", uid, attrObj, {
                success: function onSuccess(resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        util.setGlobalVar(window.kc.ns.k.current_article_id, resultObj["articleid"]);
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"');
                        item.html(renderHtml);
                        // send repsonse event
                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(document, responseEvent, {});
                        }

                        thisRef.trigger(window.kc.ns.e.command.uiDroppableActivate);
                        thisRef.trigger(window.kc.ns.e.targetArticleChanged);
                    }
                    else{
                        console.log("create article error");
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.createArticle;
                        errData[window.kc.ns.k.error_message] = "create article error";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function onError(err){
                    console.log(err.message);
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.createArticle;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                    return;
                }
            });
        }

        this.dataUpdateArticle = function(e, data) {
            var title = data.para.title;
            var desc = data.para.desc;
            var image = data.para.image;
            var aid = util.getGlobalVar(window.kc.ns.k.current_article_id);
            var uid = util.getGlobalVar(window.kc.ns.k.current_user_id);

            if (util.isEmptyStr(aid)) {
                var errData = {};
                errData[window.kc.ns.k.error_result_code] = 1;
                errData[window.kc.ns.k.error_operation]= window.kc.ns.e.updateArticle;
                errData[window.kc.ns.k.error_message] = "no article in use";
                thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                return;
            }

            var responseEvent = data.respEvent;
            var thisRef = this;

            this.articleUpdatefunc(aid, uid, title, desc, image, {
                success: function onSuccess(resultStr){
                    //basically u don't need to do anything here
                    console.log('update aricle title image success');
                    if (!util.isEmptyStr(responseEvent)) {
                        thisRef.trigger(responseEvent, {});
                    }
                    return;
                },
                error: function onError(err){
                    console.log(err.message);
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.updateArticle;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                    return;
                }
            });
        }

        this.pruneArticle = function(e, data) {
            var aid = util.getGlobalVar(window.kc.ns.k.current_article_id);
            var uid = util.getGlobalVar(window.kc.ns.k.current_user_id);

            if (util.isEmptyStr(aid)) {
                var errData = {};
                errData[window.kc.ns.k.error_result_code] = 1;
                errData[window.kc.ns.k.error_operation]= window.kc.ns.e.pruneArticle;
                errData[window.kc.ns.k.error_message] = "no article in use";
                thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                return;
            }

            var item = $(data.el);
            var responseEvent = data.respEvent;
            var thisRef = this;

            this.articlefunc("pruneArticle", aid, uid, {}, {
                success: function onSuccess(resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"');
                        item.html(renderHtml);
                        util.setGlobalVar(window.kc.ns.k.current_article_id, aid);
                        // send repsonse event
                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(responseEvent, {});
                        }
                        thisRef.trigger(window.kc.ns.e.command.uiDroppableActivate);
                    }
                    else{
                        console.log("render article error");
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.pruneArticle;
                        errData[window.kc.ns.k.error_message] = "fail to prune article";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function onError(err){
                    console.log(err.message);
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.pruneArticle;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                    return;
                }
            });

        }

        this.dataDeleteArticle = function(e, data) {
            var aid = util.getGlobalVar(window.kc.ns.k.current_article_id);
            var uid = util.getGlobalVar(window.kc.ns.k.current_user_id);
            var responseEvent = data.respEvent;
            var thisRef = this;
            // TODO TODO add userid to here
            this.articlefunc("deleteArticle", aid, uid, {}, {
                success: function onSuccess(resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        util.setGlobalVar(window.kc.ns.k.current_article_id) = resultObj["articleid"];
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"');
                        item.html(renderHtml);
                        // send repsonse event
                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(responseEvent, {});
                        }

                        thisRef.trigger(window.kc.ns.e.targetArticleChanged);
                    }
                    else{
                        console.log("create article error");
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.deleteArticle;
                        errData[window.kc.ns.k.error_message] = "fail to delete article";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function onError(err){
                    console.log(err.message);
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.deleteArticle;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                    return;
                }
            });
        }


        this.dataRenderArticle = function(e, data) {
            var uid = util.getGlobalVar(window.kc.ns.k.current_user_id);
            //var aid = util.getGlobalVar(window.kc.ns.k.current_article_id);

            var aid = data.aid;
            var attrObj = {};
            attrObj.style = data.para;
            var item = $(data.el);
            //var kcpath = util.constructKcPath(item.context);
            //var parentItem = item;
            //parentItem = util.findParentContainer(item);
            var responseEvent = data.respEvent;
            var thisRef = this;

            // TODO TODO add userid to here
            this.articlefunc("renderArticle", aid, uid, {}, {
                success: function onSuccess(resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"');
                        item.html(renderHtml);
                        util.setGlobalVar(window.kc.ns.k.current_article_id, aid);
                        // send repsonse event
                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(responseEvent, {});
                        }

                        thisRef.trigger(window.kc.ns.e.command.uiDroppableActivate);
                        thisRef.trigger(window.kc.ns.e.targetArticleChanged);
                    }
                    else{
                        console.log("render article error");
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.renderArticle;
                        errData[window.kc.ns.k.error_message] = "fail to render article";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function onError(err){
                    console.log(err.message);
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.renderArticle;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                    return;
                }
            });
        }

        this.articlefunc = function articlefunc(operation, articleid, userid, as, cb) {
            $.ajax({
                type: "POST",
                url: "/mdop",
                data: JSON.stringify({op: operation, aid: articleid, uid:userid, attrs:as}),
                contentType: "application/json; charset=utf-8",
                dataType: "html",
                success: function (result) {
                    cb.success(result);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    var err = new Error("http request error" + XMLHttpRequest.status);
                    cb.error(err);
                }
            });
        },

        // this is only used for updating aritcal title and img
        this.articleUpdatefunc = function articlefunc(aid, uid, fulltitle, adesc, image, cb) {
            $.ajax({
                type: "POST",
                url: "/users/updateUserArticleTitleImg",
                data: JSON.stringify({userid: uid, articleid: aid, title:fulltitle, desc:adesc, img:image}),
                contentType: "application/json; charset=utf-8",
                dataType: "html",
                success: function (result) {
                    cb.success(result);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    var err = new Error("http request error" + XMLHttpRequest.status);
                    cb.error(err);
                }
            });
        },

        this.getArticleInfoFunc = function getArticleInfoFunc(e, data ){
            var aid = util.getGlobalVar(window.kc.ns.k.current_article_id);
            var uid = util.getGlobalVar(window.kc.ns.k.current_user_id);
            thisRef = this;
            $.ajax({
                type: "POST",
                url: "/users/getArticleInfo",
                data: JSON.stringify({userid: uid, articleid: aid }),
                contentType: "application/json; charset=utf-8",
                dataType: "html",
                success: function (resultstr) {
                    var result = JSON.parse(resultstr);
                    if (result['result'] == '0') {
                        if (result['obj'] != undefined){
                            thisRef.trigger(window.kc.ns.e.resp.get_article_info, result);
                        }
                        return;
                    }
                    else{
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.getArticleInfo;
                        errData[window.kc.ns.k.error_message] = "no such article";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.getArticleInfo;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                    return;
                }
            });
        }

        this.after('initialize', function() {
            this.on(document, window.kc.ns.e.createArticle, this.dataCreateArticle);
            this.on(document, window.kc.ns.e.updateArticle, this.dataUpdateArticle);
            this.on(document, window.kc.ns.e.deleteArticle, this.dataDeleteArticle);
            this.on(document, window.kc.ns.e.renderArticle, this.dataRenderArticle);
            this.on(document, window.kc.ns.e.pruneArticle, this.pruneArticle);
            this.on(document, window.kc.ns.e.getArticleInfo, this.getArticleInfoFunc);
        });
    }
})
