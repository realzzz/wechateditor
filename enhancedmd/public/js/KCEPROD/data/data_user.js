/*
 * @Author: Vaninadh
 * @Date:   2016-04-01 15:28:29
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-22 17:02:37
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;

    return defineComponent(dataUser);

    function dataUser() {
        this.attributes({
            pagecount: 10
        });

        this.getArticleList = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    pageid: data.pageid,
                    pagecount: this.attr.pagecount
                },
                url: "/users/getUserArticles",
                triggerName: ns.e.article.uiArticleList,
                triggerData: function(result) {
                    return {
                        json: result
                    };
                }
            };
            this.dataResolve(option);
        };

        this.deleteArticle = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    articleid: data.articleid
                },
                url: "/users/deleteUserArticle",
                triggerName: ns.e.article.uiArticleDelete,
                triggerData: function(result) {
                    return {
                        json: result
                    };
                }
            };
            this.dataResolve(option);
        };

        this.editArticle = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    articleid: data.articleid
                },
                url: "/users/getArticleInfo",
                triggerName: ns.e.article.uiArticleEdit,
                triggerData: function(result) {
                    return {
                        json: result
                    };
                }
            };
            this.dataResolve(option);
        };

        this.getTemlateList = function(e, data) {
            var option = {
                data: {
                    type: data.type,
                    subtype: data.subtype,
                    pageid: data.pageid,
                    pagecount: this.attr.pagecount
                },
                url: "/template/getTemplateByType",
                triggerName: ns.e.tab.uiTemplateList,
                triggerData: function(result) {
                    return {
                        json: result
                    };
                }
            };
            this.dataResolve(option);
        };

        this.putTemplateCollect = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    templateid: data.id,
                    userid: uid,
                    orihtml: data.orihtml
                },
                url: "/users/addUserCollection",
                triggerName: ns.e.tab.uiTemplateCollectEffect,
                triggerData: function(result) {
                    return {
                        json: result,
                        el: data.el
                    };
                }
            };
            this.dataResolve(option);
        };

        this.getTemplateCollectList = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    type: data.type,
                    pageid: data.pageid,
                    pagecount: this.attr.pagecount
                },
                url: "/users/getUserCollection",
                triggerName: ns.e.tab.uiTemplateCollectList,
                triggerData: function(result) {
                    return {
                        json: result
                    };
                }
            };
            this.dataResolve(option);
        };

        this.deleteTemplateCollect = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    cid: data.cid
                },
                url: "/users/deleteUserCollection",
                triggerName: ns.e.tab.uiTemplateCollectDelete,
                triggerData: function(result) {
                    return {
                        json: result,
                        el: data.el
                    };
                }
            };
            this.dataResolve(option);
        };

        this.getInlineblockCollectList = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    type: data.type,
                    pageid: data.pageid,
                    pagecount: this.attr.pagecount
                },
                url: "/users/getUserCollection",
                triggerName: ns.e.tab.uiInlineblockCollectList,
                triggerData: function(result) {
                    return {
                        json: result
                    };
                }
            };
            this.dataResolve(option);
        };

        this.deleteInlineblockCollect = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    cid: data.cid
                },
                url: "/users/deleteUserCollection",
                triggerName: ns.e.tab.uiInlineblockCollectDelete,
                triggerData: function(result) {
                    return {
                        json: result,
                        el: data.el
                    };
                }
            };
            this.dataResolve(option);
        };

        this.getPicList = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    pageid: data.pageid,
                    pagecount: this.attr.pagecount
                },
                url: "/users/getUserLibrary",
                triggerName: data.triggerEvent,
                triggerData: function(result) {
                    return {
                        json: result
                    };
                }
            };
            this.dataResolve(option);
        };

        this.deletePic = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    lid: data.lid
                },
                url: "/users/deleteUserLibrary",
                triggerName: data.triggerEvent,
                triggerData: function(result) {
                    return {
                        json: result,
                        el: data.el
                    };
                }
            };
            this.dataResolve(option);
        };

        this.addPic = function(e, data) {
            var uid = util.getGlobalVar(ns.k.current_user_id);
            var option = {
                data: {
                    userid: uid,
                    url: data.url
                },
                url: "/users/addUserLibrary",
                triggerName: data.triggerEvent,
                triggerData: function(result) {
                    return {
                        json: result,
                        url: data.url
                    };
                }
            };
            this.dataResolve(option);
        };

        this.dataResolve = function(options) {
            var that = this;
            $.ajax({
                type: "POST",
                url: options.url,
                data: JSON.stringify(options.data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(result) {
                    that.trigger(options.triggerName, options.triggerData(result));
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    var err = new Error("http request error" + XMLHttpRequest.status);
                }
            });
        }

        this.updateArticleUserinfo = function(options){
            var that = this;
            var aid = util.getGlobalVar(window.kc.ns.k.current_article_id);
            var uid = util.getGlobalVar(window.kc.ns.k.current_user_id);
            if (util.isEmptyStr(aid) || util.isEmptyStr(uid)) {
                return;
            }

            $.ajax({
                type: "POST",
                url: "/users/updateAritcleUserInfo",
                data: JSON.stringify({userid:uid,articleid:aid}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(result) {
                    console.log('updateArticleUserinfo done');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    var err = new Error("http request error" + XMLHttpRequest.status);
                }
            });

        }

        this.after("initialize", function() {
            this.on(document, ns.e.data.dataArticleList, this.getArticleList);
            this.on(document, ns.e.data.dataArticleEdit, this.editArticle);
            this.on(document, ns.e.data.dataArticleDelete, this.deleteArticle);
            this.on(document, ns.e.data.dataTemplateList, this.getTemlateList);
            this.on(document, ns.e.data.dataTemplateCollect, this.putTemplateCollect);
            this.on(document, ns.e.data.dataTemplateCollectList, this.getTemplateCollectList);
            this.on(document, ns.e.data.dataInlineblockCollectList, this.getInlineblockCollectList);
            this.on(document, ns.e.data.dataInlineblockCollectDelete, this.deleteInlineblockCollect);
            this.on(document, ns.e.data.dataTemplateCollectDelete, this.deleteTemplateCollect);
            this.on(document, ns.e.data.dataPicList, this.getPicList);
            this.on(document, ns.e.data.dataPicDelete, this.deletePic);
            this.on(document, ns.e.data.dataPicAdd, this.addPic);

            this.on(document, ns.e.updateAricleUserInfo, this.updateArticleUserinfo);
        });
    }
});
