/*
 * @Author: Vaninadh
 * @Date:   2016-04-18 18:59:40
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-20 10:46:02
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    return uiMixinRotate;

    function uiMixinRotate() {
        this.attributes({
            rotateDom: "",
            rotateSelector: "#rotatorController",
            resetRotateSelector: "#resetRotate"
        });

        this.renderRotate = function() {
            this.attr.rotateDom = $(this.getRotateHtml());
            this.attachEventToRotate();
            this.attr.rotateDom.appendTo(this.attr.propertyPanelDom);
        };

        this.attachEventToRotate = function() {
            var meRotateDom = this.attr.rotateDom;
            var me = this;
            var rotateObj = meRotateDom.find(this.attr.rotateSelector);

            this.attr.rotateDom.find(this.attr.rotateSelector).propeller({
                inertia: 0,
                speed: 0,
                onRotate: function(){

                    var angle= Math.round( this.angle );
                    var paramObj = {};
                    paramObj["-ms-transform"] = "rotate("+angle+"deg)";
                    paramObj["-webkit-transform"] = "rotate("+angle+"deg)";
                    paramObj["transform"] = "rotate("+angle+"deg)";

                    var el = me.attr.targetEl;
                    var kctype = $(el).attr('kctype');
                    if (kctype == "image") {
                        if ($(el).children('img').attr('style') === undefined) {
                            // not graceful but working logic
                            var w = $(el).children('img').width();
                            var h = $(el).children('img').height();
                            if (w != 0 && h != 0) {
                                paramObj["width"]=w+'px';
                                paramObj["height"]=h+'px';
                            }
                        }
                    }

                    if(me.attr.targetItemKcPath !== ''){
                        me.trigger(ns.e.updateNode, {
                            para: {
                                style: paramObj
                            },
                            kcpath: me.attr.targetKcPath
                        });
                    }
                }
            });

            this.on(document, "click", {
                resetRotateSelector: this.resetRotate
            });

        };

        this.prepareRotate = function() {
            //var oriRadius = this.attr.targetEl.css('borderRadius');
            var me = this;

        };

        this.resetRotate = function() {
            var me = this;
            var paramObj = {};
            paramObj["-ms-transform"] = "";
            paramObj["-webkit-transform"] = "";
            paramObj["transform"] = "";

            if(me.attr.targetItemKcPath !== ''){
                me.trigger(ns.e.updateNode, {
                    para: {
                        style: paramObj
                    },
                    kcpath: me.attr.targetKcPath
                });
            }
        };

        this.getRotateHtml = function() {
            return [
                '<div class="borderB1">',
                '<div class="font14 colorWhite pl15 pt10">旋转</div>',
                '<div class="pt5 pb15 textC barBox">',
                '<div>\
                    <img class="turbine" width="40px" height="auto" id="rotatorController" src="./img/turbine.png" >\
                    <a class="turbine colorWhite pl15" id="resetRotate" >重置</a>\
                 </div>',
                '</div>'
            ].join('\n');
        }
    };
});
