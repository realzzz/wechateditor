/*
 * @Author: Vaninadh
 * @Date:   2016-04-05 17:30:52
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-05 19:14:25
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;

    return defineComponent(deleteable);

    function deleteable() {
        this.attributes({});

        //keep the click data el in this class
        this.activateDeleteable = function(e, data) {
            this.attr.targetData = data;
        }

        this.executeDeleteable = function() {
            var data = this.attr.targetData;
            if (data === undefined) {
                return;
            }
            var me = this;
            this.trigger(ns.e.canvas.uiNotifyConfirm, {
                    confirmCallBk: function() {
                        me.trigger(ns.e.deleteNode, {
                            el: data.el
                        })
                    }
                });

        }

        this.after("initialize", function() {
            this.on(document, ns.e.command.uiDeleteableActivate, this.activateDeleteable);
            this.on(document, ns.e.command.uiDeleteableExecute, this.executeDeleteable);
        });
    }
});
