/*
 * @Author: Vaninadh
 * @Date:   2016-05-06 11:36:27
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-10 19:44:37
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var cookie = require("cookie");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    var theme_map = {
        'default': { body: '' },
        'lightblue': { body: 'lightblue' }
    }
    return defineComponent(uiSkinChange);

    function uiSkinChange() {
        this.attributes({
            loadonce: false,
            skinChangeBoxSelector: ".skin-change-box",
            skinChangeBtnSelector: "#skin-change",
            skinFloatSelector: "#skin-float",
            eventTag: "a",
            themeCookie: "kceditor.theme"
                //color="#0485a4"
        });

        this.activateSkinChange = function(e, data) {
            this.on(this.attr.skinFloatSelector, "click", {
                eventTag: this.skinChange
            });
            var cookieK = cookie.get(this.attr.themeCookie);
            if (cookieK != undefined) {
                this.doChange(theme_map[cookieK]);
            }
        }

        this.skinChange = function(e, data) {
            var themeK = $(data.el).data('theme');
            this.doChange(theme_map[themeK]);
            cookie.set(this.attr.themeCookie, themeK);
        }

        this.doChange = function(themeV) {
            if (themeV.body != undefined) {
                $('body').attr({
                    class: themeV.body
                })
            }
        }

        this.after('initialize', function() {
            console.log("uiSkinChange is ok!");
            this.on(document, ns.e.canvas.uiSkinChange, this.activateSkinChange);
        });
    }
})
