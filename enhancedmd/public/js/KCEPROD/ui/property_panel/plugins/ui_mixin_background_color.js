/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 10:47:22
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-18 19:19:23
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    return uiMixinBackgroundColor;

    function uiMixinBackgroundColor() {
        this.attributes({
            backgroundColorDom: "",
            backgroundColorBoxSelector:"#uiBackgroundColorBox input"
        });

        this.renderBackgroundColor = function() {
            this.attr.backgroundColorDom = $(this.getBackgroundColorHtml());
            this.attachEventToBackgroundColor();
            this.attr.backgroundColorDom.appendTo(this.attr.propertyPanelDom);
        };

        this.attachEventToBackgroundColor = function() {
            var mePropertyDom = this.attr.backgroundColorDom;
            var me = this;
            var colorInputObj = mePropertyDom.find(this.attr.backgroundColorBoxSelector);

            colorInputObj.minicolors({
                format: 'rgb',
                opacity:false,
                defaultValue: 'rgb(1,1,1,0)',
                change: function(value, opacity) {
                    if(me.attr.targetEl.css('backgroundColor') !== value){
                        if (me.attr.targetEl[0].attributes['kctype'].value === 'text') {
                            // text has it's own way of style presentation
                            if (util.getGlobalVar(window.kc.ns.k.text_current_selection_start) == util.getGlobalVar(window.kc.ns.k.text_current_selection_end)) {
                                me.trigger(ns.e.updateNode, {
            		                para: {
            		                    style: {
            		                        'background-color': value
            		                    }
            		                },
            		                kcpath: me.attr.targetKcPath
                        		});
                            }
                            else{
                                var textStyleChangeObj = {};
                                var crkey = util.getGlobalVar(window.kc.ns.k.text_current_selection_start) + "-" + util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
                                var changeStyle = {"background-color":value};
                                textStyleChangeObj[crkey] = changeStyle;

                                me.trigger(ns.e.updateNode, {
                                    para: {
                                        "chtrstyle":textStyleChangeObj
                                    },
                                    kcpath: me.attr.targetKcPath
                                });
                            }
                        }
                        else{
                            me.attr.targetEl.css("background-color", value);
                        }
                    }
                },
                hide:function(){
                    if (me.attr.targetEl[0].attributes['kctype'].value === 'text') {
                        // text has it's own way of style presentation

                    }
                    else{
                        me.trigger(ns.e.updateNode, {
    		                para: {
    		                    style: {
    		                        'background-color': me.attr.targetEl.css("background-color")
    		                    }
    		                },
    		                kcpath: me.attr.targetKcPath
                		});
                    }
                }
            });

        };

        this.prepareBackgroundColor=function(){

        	this.attr.propertyData.style.color = this.attr.targetEl.css('backgroundColor');

        	var mePropertyDom = this.attr.backgroundColorDom;
        	var colorInputObj = mePropertyDom.find(this.attr.backgroundColorBoxSelector);

        	colorInputObj.minicolors('value',this.attr.propertyData.style.color);
        };

        this.getBackgroundColorHtml = function() {
            return [
                '<div class="borderB1">',
                '<div class="font14 colorWhite pl15 pt10">背景色</div>',
                '<div id="uiBackgroundColorBox" class="pt5 pb15 textC barBox">',
                '<input type="text">',
                '</div>'
            ].join('\n');
        }
    };
});
