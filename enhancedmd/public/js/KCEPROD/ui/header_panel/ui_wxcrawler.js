/*
 * @Author: Vaninadh
 * @Date:   2016-03-29 11:59:56
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-16 17:06:11
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;
    return defineComponent(wxCrawler);

    function wxCrawler() {
        this.attributes({
            crawlerInput: '#grabInput',
            crawlerBtn: ".confirmGrabBtn",
            canvasClass: '.canvas'
        });

        this.doWxCrawl = function() {
            var url = $(this.attr.crawlerInput)[0].value;
            var uid = util.getGlobalVar(ns.k.current_user_id);

            if (util.isEmptyStr(url)) {
                var errData = {};
                errData[ns.k.error_result_code] = 1;
                errData[ns.k.error_operation] = "crawl weixin";
                errData[ns.k.error_message] = "input link is empty";
                this.trigger(document, ns.e.generalError, errData);
                return;
            } else {
                // actually this happens on server
                var thisRef = this;
                $.ajax({
                    type: "POST",
                    url: "/users/createArticleViaWxArt",
                    data: JSON.stringify({ userid: uid, wxurl: url }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "html",
                    success: function(result) {
                        var resultObj = JSON.parse(result);
                        if (resultObj["result"] === "0") {

                            //changed by cxy
                            thisRef.trigger(ns.e.canvas.uiRenderCanvas, {
                                articleid: resultObj["articleid"],
                                html: resultObj["content"].replace(/\\"/g, '"'),
                                title: resultObj["title"],
                                description: ""
                            });

                        } else {
                            var errData = {};
                            errData[ns.k.error_result_code] = 1;
                            errData[ns.k.error_operation] = "fetch wechat article";
                            errData[ns.k.error_message] = resultObj.error;
                            thisRef.trigger(document, ns.e.generalError, errData);
                            return;
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        var errData = {};
                        errData[ns.k.error_result_code] = 1;
                        errData[ns.k.error_operation] = "fetch wechat article";
                        errData[ns.k.error_message] = "failure";
                        thisRef.trigger(document, ns.e.generalError, errData);
                        return;

                    }
                });

            }
        }

        this.after('initialize', function() {
            console.log("wxCrawler is ok!");
            this.on(this.attr.crawlerBtn, "click", this.doWxCrawl);
        });
    }
})