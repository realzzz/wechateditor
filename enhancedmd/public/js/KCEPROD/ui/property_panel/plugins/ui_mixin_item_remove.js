/*
 * @Author: Vaninadh
 * @Date:   2016-04-18 18:59:40
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-05 19:12:40
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    return uiMixinItemRemove;

    function uiMixinItemRemove() {
        this.attributes({
            removeDom: "",
            removeSelector: "#itemRemove",
            cloneSelector: "#itemClone"
        });

        this.renderRemove = function() {
            this.attr.removeDom = $(this.getRemoveHtml());
            this.attachEventToRemove();
            this.attr.removeDom.appendTo(this.attr.propertyPanelDom);
        };

        this.attachEventToRemove = function() {
            this.on(this.attr.removeDom, "click", {
                removeSelector: this.removeItem,
                cloneSelector: this.cloneItem
            });
        };

        this.prepareRemove = function() {
            //var oriRadius = this.attr.targetEl.css('borderRadius');
            var me = this;

        };
        this.cloneItem = function() {
            var me = this;

            if(me.attr.targetItemKcPath !== ''){
                me.trigger(ns.e.cloneNode, {
                    para: {

                    },
                    kcpath: me.attr.targetKcPath
                });
            }


        };
        this.removeItem = function() {
            var me = this;
            
            if(me.attr.targetItemKcPath !== ''){
                me.trigger(ns.e.deleteNode, {
                    para: {

                    },
                    kcpath: me.attr.targetKcPath
                });
            }

            //this.trigger(ns.e.command.uiDeleteableExecute);
        };

        this.getRemoveHtml = function() {
            return [
                '<div class="borderB1">',
                '<div class="font14 colorWhite pl15 pt10"></div>',
                '<div class="pt5 pb15 textC barBox">',
                '<div>\
                    <a class="colorWhite pr15" id="itemClone" title="克隆">克隆</a>\
                    <a class="colorWhite pl10" id="itemRemove" title="删除">删除</a>\
                 </div>',
                '</div>'
            ].join('\n');
        }
    };
});
