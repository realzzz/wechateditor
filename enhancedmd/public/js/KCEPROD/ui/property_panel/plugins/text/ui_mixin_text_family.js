/*
 * @Author: Vaninadh
 * @Date:   2016-04-19 14:56:34
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-21 17:16:50
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    return uiMixinTextFamily;

    function uiMixinTextFamily() {
        this.attributes({
            textFamilyDom: "",
            textFamilySelector: "#uiTextFamily",
            textSizeSelector: "#uiTextSize"
        });

        this.renderTextFamily = function() {
            this.attr.textFamilyDom = $(this.getTextFamilyHtml());
            this.attachEventToTextFamilyDom();
            this.attr.textFamilyDom.appendTo(this.attr.propertyPanelDom);
        };

        this.attachEventToTextFamilyDom = function() {
            var mePropertyDom = this.attr.textFamilyDom;
            var me = this;
            var textFamilyObj = mePropertyDom.find(this.attr.textFamilySelector);
            //init select
            var fontfamily = [
                { name: '宋体', val: '宋体,SimSun' },
                { name: '微软雅黑', val: '微软雅黑,Microsoft YaHei' },
                { name: '楷体', val: '楷体,楷体_GB2312, SimKai' },
                { name: '黑体', val: '黑体, SimHei' },
                { name: '隶书', val: '隶书, SimLi' },
                { name: 'andale mono', val: 'andale mono' },
                { name: 'arial', val: 'arial, helvetica,sans-serif' },
                { name: 'arial blac', val: 'arial black,avant garde' },
                { name: 'comic sans ms', val: 'comic sans ms' },
                { name: 'impact', val: 'impact,chicago' },
                { name: 'times new roman', val: 'times new roman' }
            ];

            for (var i in fontfamily) {
                $('<option>').attr({
                    value: fontfamily[i].val
                }).html(fontfamily[i].name).appendTo(textFamilyObj);
            }
            //end init select

            textFamilyObj.selectmenu({
                appendTo: me.attr.propertyPanelDom,
                width: 139,
                icons: {
                    button: "iconfont icon-xiala"
                },
                change: function(event, data) {
                    if (util.getGlobalVar(window.kc.ns.k.text_current_selection_start) != util.getGlobalVar(window.kc.ns.k.text_current_selection_end)) {
                        var textStyleChangeObj = {};
                        var crkey = util.getGlobalVar(window.kc.ns.k.text_current_selection_start) + "-" + util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
                        textStyleChangeObj[crkey] = {'font-family': data.item.value};

                        me.trigger(ns.e.updateNode, {
                            para: {
                                "chtrstyle":textStyleChangeObj
                            },
                            kcpath: me.attr.targetKcPath
                        });
                    }else{
                        me.trigger(ns.e.updateNode, {
                            para: {
                                style: {
                                    'font-family': data.item.value
                                }
                            },
                            kcpath: me.attr.targetKcPath
                        });
                    }
                }
            });

            // Text Size

            var textSizeObj = mePropertyDom.find(this.attr.textSizeSelector);
            //init select
            var sizefamily = [
                { name: '', val: '' },
                { name: '8', val: '8px' },
                { name: '10', val: '10px' },
                { name: '12', val: '12px' },
                { name: '14', val: '14px' },
                { name: '16', val: '16px' },
                { name: '20', val: '20px' },
                { name: '25', val: '25px' },
                { name: '30', val: '30px' },
                { name: '40', val: '40px' },
                { name: '50', val: '50px' },
                { name: '80', val: '80px' },
            ];


            for (var i in sizefamily) {
                $('<option>').attr({
                    value: sizefamily[i].val
                }).html(sizefamily[i].name).appendTo(textSizeObj);
            }
            //end init select

            textSizeObj.selectmenu({
                appendTo: me.attr.propertyPanelDom,
                width: 70,
                icons: {
                    button: "iconfont icon-xiala"
                },
                change: function(event, data) {
                    if (util.getGlobalVar(window.kc.ns.k.text_current_selection_start) != util.getGlobalVar(window.kc.ns.k.text_current_selection_end)) {
                        var textStyleChangeObj = {};
                        var crkey = util.getGlobalVar(window.kc.ns.k.text_current_selection_start) + "-" + util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
                        textStyleChangeObj[crkey] = {'font-size': data.item.value};

                        me.trigger(ns.e.updateNode, {
                            para: {
                                "chtrstyle":textStyleChangeObj
                            },
                            kcpath: me.attr.targetKcPath
                        });
                    }else{
                        me.trigger(ns.e.updateNode, {
                            para: {
                                style: {
                                    'font-size': data.item.value
                                }
                            },
                            kcpath: me.attr.targetKcPath
                        });
                    }
                }
            });

        };


        this.prepareTextFamily = function() {
            //todo set value have some bugs

            /*this.attr.propertyData.style['font-family'] = this.attr.targetEl.css('font-family');
            var mePropertyDom = this.attr.textFamilyDom;
            var textFamilyObj = mePropertyDom.find(this.attr.textFamilySelector);
            console.log(this.attr.propertyData.style['font-family']);
            textFamilyObj.val(this.attr.propertyData.style['font-family']);
            textFamilyObj.selectmenu("refresh");*/
        };

        this.getTextFamilyHtml = function() {
            return [
                '<div id="uiMixinTextCenter" >',
                '<div class="font14 colorWhite pl15 pt10">字体</div>',
                '</div>',
                '<div class="borderB1">',
                '<div class="dropWrapper pt5 pb10 pl10 pr10 ">',
                '<div class="dropBox">',
                '<select id="uiTextFamily" >',
                '</select>',
                '<select id="uiTextSize">',
                '</select>',
                '</div>',
                '</div>',
                '</div>',
                '</div>'
            ].join('\n');
        }
    };
});
