/*
 * @Author: Vaninadh
 * @Date:   2016-03-30 19:52:42
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-13 16:16:43
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var Mustache = require("mustache");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    var uiCell3rdParty = require('KCEPROD/ui/sider_panel/cell/ui_cell_3rdparty');

    return defineComponent(uiTabPanel3rdParty);

    function uiTabPanel3rdParty() {
        this.attributes({
            loadonce: false,
            linkinput: '#others-url-input',
            crawlbtn: '#others-url-btn',
            clearbtn: '#others-clear-btn',
            othersbox: '#othersbox',
            otherkeyarea: '#others-key-area',
            otherkeyinput: '#others-key-input'
        });

        this.renderTab = function(e, data) {
            if (!this.attr.loadonce) {
                console.log("uiTabPanel3rdParty render is ok!");
                this.on(this.attr.crawlbtn, "click", this.doCrawl);
                this.on(this.attr.clearbtn, "click", this.doClearBtn);
                this.on(this.attr.linkinput, "keyup", this.checkInput);
            }
            this.attr.loadonce = true;
        }

        this.doCrawl = function(e) {
            var link = $(this.attr.linkinput)[0].value;
            var keyword = $(this.attr.otherkeyinput)[0].value;

            if (util.isEmptyStr(link)) {
                var errData = {};
                errData[ns.k.error_result_code] = 1;
                errData[ns.k.error_operation] = ns.e.fetch_thirdparty_link;
                errData[ns.k.error_message] = "input link is empty";
                this.trigger(document, ns.e.generalError, errData);
                return;
            } else if (link.indexOf("weibo") > -1 && util.isEmptyStr(keyword)) {
                var errData = {};
                errData[ns.k.error_result_code] = 1;
                errData[ns.k.error_operation] = ns.e.fetch_thirdparty_link;
                errData[ns.k.error_message] = "weibo key link is empty";
                this.trigger(document, ns.e.generalError, errData);
                return;
            } else {
                thisRef = this;
                $.ajax({
                    type: "POST",
                    url: "/fetch3rdpartlink",
                    data: JSON.stringify({ url: link, key: keyword }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "html",
                    success: function(resultStr) {
                        var resultObj = JSON.parse(resultStr);
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"')
                        renderHtml = util.removeKcAttr(renderHtml);
                        renderHtml = '<section class="temp-repe" style="width:280px" targettype="ext" url="' + link + '" key="' + keyword + '" >' + renderHtml + '</section>'
                        $(thisRef.attr.othersbox).html(renderHtml);

                        uiCell3rdParty.attachTo('.temp-repe');
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest.status);
                        console.log(XMLHttpRequest.readyState);
                        console.log(textStatus);
                    }
                });
            }
        }

        this.doClearBtn = function(e) {
            console.log("clear btn triggered");

            $(this.attr.linkinput)[0].value = '';
            $(this.attr.otherkeyinput)[0].value = '';
            $(this.attr.othersbox).html('');
        }

        this.checkInput = function(e) {
            var inputstr = $(this.attr.linkinput)[0].value;
            if (!util.isEmptyStr(inputstr)) {
                if (inputstr.indexOf("weibo") > -1) {
                    $(this.attr.otherkeyinput)[0].value = '';
                    $(this.attr.otherkeyarea).show();
                } else {
                    $(this.attr.otherkeyarea).hide();
                }
            }
        }

        this.after("initialize", function() {
            console.log("uiTabPanel3rdParty is ok!");
            this.on(ns.e.tab.uiTabOthers, this.renderTab);
        });
    }
});