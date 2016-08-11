/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 10:47:22
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-18 19:19:23
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    var predefinedColors = [["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]];
    return uiMixinTextColor;

    function uiMixinTextColor() {
        this.attributes({
            textColorDom: "",
            textColorBoxSelector:"#uiTextColorBox",
            spectrumLoaded: false
        });

        this.renderTextColor = function() {
            this.attr.textColorDom = $(this.getTextColorHtml());
            this.attachEventToTextColor();
            this.attr.textColorDom.appendTo(this.attr.propertyPanelDom);
        };

        this.attachEventToTextColor = function() {
            var mePropertyDom = this.attr.textColorDom;
            var me = this;
            var colorInputObj = mePropertyDom.find(this.attr.textColorBoxSelector);


            /*
            colorInputObj.minicolors({
                format: 'rgb',
                opacity:false,
                defaultValue: 'rgb(1,1,1,0)',
                change: function(value, opacity) {
                    if (me.attr.targetEl[0].attributes['kctype'].value === 'text') {
                        // text has it's own way of style presentation
                        if (util.getGlobalVar(window.kc.ns.k.text_current_selection_start) != util.getGlobalVar(window.kc.ns.k.text_current_selection_end)) {
                            var textStyleChangeObj = {};
                            var crkey = util.getGlobalVar(window.kc.ns.k.text_current_selection_start) + "-" + util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
                            var changeStyle = {"color":value};
                            textStyleChangeObj[crkey] = changeStyle;

                            me.trigger(ns.e.updateNode, {
                                para: {
                                    "chtrstyle":textStyleChangeObj
                                },
                                kcpath: me.attr.targetKcPath
                            });
                        }
                        else{
                            if(me.attr.targetEl.css('color') !== value){
                                me.trigger(ns.e.updateNode, {
                                    para: {
                                        style: {
                                            'color': value
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
            */

        };
        this.applyColorChange = function(me, color, keyOfStyle){

            var value = color.toRgbString();
            if (keyOfStyle == "text-shadow") {
                value = value + "2px 2px 10px";
            }
            var changeStyle = {};
            changeStyle[keyOfStyle]= value;

            if (me.attr.targetEl[0].attributes['kctype'].value === 'text') {
                // text has it's own way of style presentation
                if (util.getGlobalVar(window.kc.ns.k.text_current_selection_start) != util.getGlobalVar(window.kc.ns.k.text_current_selection_end)) {
                    var textStyleChangeObj = {};
                    var crkey = util.getGlobalVar(window.kc.ns.k.text_current_selection_start) + "-" + util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
                    textStyleChangeObj[crkey] = changeStyle;

                    me.trigger(ns.e.updateNode, {
                        para: {
                            "chtrstyle":textStyleChangeObj
                        },
                        kcpath: me.attr.targetKcPath
                    });
                }
                else{
                    if(me.attr.targetEl.css('color') !== value){
                        me.trigger(ns.e.updateNode, {
                            para: {
                                style: changeStyle
                            },
                            kcpath: me.attr.targetKcPath
                        });
                    }
                }
            }
        }

        this.prepareTextColor=function(){
            var thisRef = this;
            if (!this.attr.spectrumLoaded) {
                $('#uiTextColorBox').spectrum({
                    preferredFormat: "rgb",
                    showPalette: true,
                    showInput: true,
                    maxSelectionSize: 3,
                    palette: predefinedColors,
                    hideAfterPaletteSelect:true,
                    change: function(color) {
                        thisRef.applyColorChange(thisRef, color, "color");
                    }
                });
                $('#uiBgColorBox').spectrum({
                    preferredFormat: "rgb",
                    showPalette: true,
                    showInput: true,
                    maxSelectionSize: 3,
                    palette: predefinedColors,
                    hideAfterPaletteSelect:true,
                    change: function(color) {
                        thisRef.applyColorChange(thisRef, color, "background-color");
                    }
                });
                $('#uiShadowColorBox').spectrum({
                    preferredFormat: "rgb",
                    showPalette: true,
                    showInput: true,
                    maxSelectionSize: 3,
                    palette: predefinedColors,
                    hideAfterPaletteSelect:true,
                    change: function(color) {
                        thisRef.applyColorChange(thisRef, color, "text-shadow");
                    }

                });
                this.attr.spectrumLoaded = true;
            }

            // get color for background or etc
            if ( !util.isEmptyStr(this.attr.targetEl.css('color'))) {
                $("#uiTextColorBox").spectrum("set", this.attr.targetEl.css('color'));
            }

            if ( !util.isEmptyStr(this.attr.targetEl.css('background-color'))) {
                $("#uiBgColorBox").spectrum("set", this.attr.targetEl.css('background-color'));
            }

        	var textshadowValue = this.attr.targetEl.css('text-shadow');
            if ( !util.isEmptyStr(textshadowValue)) {
                var cutIdx = textshadowValue.indexOf('2px');
                if (cutIdx > -1) {
                    var shadowV = textshadowValue.substring(0,cutIdx);
                    $("#uiShadowColorBox").spectrum("set", shadowV);
                }
            }

        	var mePropertyDom = this.attr.textColorDom;
        	var colorInputObj = mePropertyDom.find(this.attr.textColorBoxSelector);

        	//colorInputObj.minicolors('value',this.attr.propertyData.style.color);
        };

        this.getTextColorHtml = function() {
            return [
                '<div class="borderB1">',
                '<div class="displayI">',
                    '<div class="font14 colorWhite pl15 pt10 textC" >文本</div>',
                    '<div class="pt5 pb15 pl15 textC barBox">',
                    '<input id="uiTextColorBox" type="text">',
                    '</div>',
                '</div>',
                '<div class="displayI">',
                    '<div class="font14 colorWhite pl15 pt10 textC" >背景</div>',
                    '<div class="pt5 pb15 pl15 textC barBox">',
                    '<input id="uiBgColorBox" type="text">',
                    '</div>',
                '</div>',
                '<div class="displayI">',
                    '<div class="font14 colorWhite pl15 pt10 textC" >阴影</div>',
                    '<div class="pt5 pb15 pl15 textC barBox">',
                    '<input id="uiShadowColorBox" type="text">',
                    '</div>',
                '</div>',
                '</div>'
            ].join('\n');
        }
    };
});
