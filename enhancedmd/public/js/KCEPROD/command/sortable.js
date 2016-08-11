/*
 * @Author: Vaninadh
 * @Date:   2016-05-17 17:05:30
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-20 16:05:22
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;
    var util = require('../util/util');
    return defineComponent(sortable);

    function sortable() {
        this.attributes({
            targetClass: "[root=true] > [kctype]",
            canvasClass: ".canvas",
            cancelSelector: ".ui-resizable-handle",
            parentSelector:"[root=true]"
        });

        this.activeSortable = function(e, data) {
            var me = this;
            $(this.attr.canvasClass).sortable({
                items: this.attr.targetClass,
                cancel: this.attr.cancelSelector,
                forceHelperSize: true,
                containment:this.attr.parentSelector,
                // placeholder: "ui-sortable-placeholder",
                placeholder: {
                    element: function(clone, ui) {
                        return $('<section style="opacity:0.2;border: 3px dashed #aaa;">' + clone[0].innerHTML + '</section>');
                    },
                    update: function(container, p) {
                        return;
                    }
                },
                opacity: 0.8,
                update: this.update.bind(this)
            });
        }

        this.update=function(event, ui){
        	//transfer to server
        	console.log('pre:'+util.constructKcPath(ui.item.prev()[0])+",after:"+util.constructKcPath(ui.item[0]));
        }

        this.after("initialize", function() {
            this.on(document, ns.e.command.uiSortableActivate, this.activeSortable);
        });
    }
});
