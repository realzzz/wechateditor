/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 10:47:22
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-18 19:19:23
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    return uiMixinTextShadow;

    function uiMixinTextShadow() {
        this.attributes({
            textShadowDom: "",
            textShadowBoxSelector:"#uiTextShadowBox input"
        });

        this.renderTextShadow = function() {
            this.attr.textShadowDom = $(this.getTextShadowHtml());
            this.attachEventToTextShadow();
            this.attr.textShadowDom.appendTo(this.attr.propertyPanelDom);
        };

        this.attachEventToTextShadow = function() {
            var mePropertyDom = this.attr.textShadowDom;
            var me = this;
            var shadowInputObj = mePropertyDom.find(this.attr.textShadowBoxSelector);

            shadowInputObj.minicolors({
                format: 'rgb',
                opacity:false,
                defaultValue: 'rgb(1,1,1,0)',
                change: function(value, opacity) {
                    if (me.attr.targetEl[0].attributes['kctype'].value === 'text') {
                        // text has it's own way of style presentation
                        if (util.getGlobalVar(window.kc.ns.k.text_current_selection_start) != util.getGlobalVar(window.kc.ns.k.text_current_selection_end)) {
                            var textStyleChangeObj = {};
                            var crkey = util.getGlobalVar(window.kc.ns.k.text_current_selection_start) + "-" + util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
                            var changeStyle = {"text-shadow": value + "2px 2px 10px"};
                            textStyleChangeObj[crkey] = changeStyle;

                            me.trigger(ns.e.updateNode, {
                                para: {
                                    "chtrstyle":textStyleChangeObj
                                },
                                kcpath: me.attr.targetKcPath
                            });
                        }
                        else{
                            if(me.attr.targetEl.css('text-shadow') !== value){
                                me.trigger(ns.e.updateNode, {
                                    para: {
                                        style: {
                                            "text-shadow": value + "2px 2px 10px"
                                        }
                                    },
                                    kcpath: me.attr.targetKcPath
                                });
                            }
                        }
                    }

                },
                hide:function(){

                }
            });

        };

        this.prepareTextShadow=function(){

        	//this.attr.propertyData.style.shadow = this.attr.targetEl.css('color');
        	//var mePropertyDom = this.attr.textShadowDom;
        	//var colorInputObj = mePropertyDom.find(this.attr.textShadowBoxSelector)
        	//colorInputObj.minicolors('value',"rgb(255,255,255)");
        };

        this.getTextShadowHtml = function() {
            return [
                '<div class="borderB1">',
                '<div class="font14 colorWhite pl15 pt10" >文本阴影</div>',
                '<div id="uiTextShadowBox" class="pt5 pb15 textC barBox">',
                '<input type="text">',
                '</div>'
            ].join('\n');
        }
    };
});
