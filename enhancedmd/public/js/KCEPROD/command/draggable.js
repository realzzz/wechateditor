/*
 * @Author: john
 * @Date:   2016-03-21 15:18:32
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-29 16:25:11
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;

    return defineComponent(draggable);

    function draggable() {
        this.attributes({
            targetClass: '[kctype]',
            canvasSelector: '.canvas',
            wrapperSelector: '.ui-wrapper',
            draggableSelector: '.ui-draggable',
        });

        //this method is different with resize.cause img tagname
        /*this.setContainment = function(targetObj) {
            var parent = targetObj.parent("[kctype=container]");
            if (parent.length > 0) {
                this.attr.containment = parent;
            } else {
                this.attr.containment = this.attr.canvasSelector;
            }
        }*/

        /*//`cause when resize init,the canvas|textarea|input|select|button|img will be wrapped a div
        // so we have to change the target to this div
        this.getTargetEl = function(data) {
            if (data.el.nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)) {
                return $(data.el).parent(this.attr.wrapperSelector);
            } else {
                return $(data.el);
            }
        }*/

        this.activateDraggable = function(e, data) {
            this.destroyDraggable();
            this.attr.targetEl = data.el;
            this.attr.$targetEl = $(data.el);
            //the final outside container cant be draggale,
            if (this.attr.containment != this.attr.canvasSelector) {
                this.attr.$targetEl.draggable({
                    containment: this.attr.canvasSelector,
                    cancel: "span",
                    stop: this.stopBehaviour.bind(this)
                });
            }
        };

        this.stopBehaviour = function(event, ui) {
            var target = $(event.target);
            //var left = (100 * parseFloat(target.css("left")) / parseFloat(target.parent().css("width"))) + "%";
            //var top = (100 * parseFloat(target.css("top")) / parseFloat(target.parent().css("height"))) + "%";

            // TODO this need to be adjusted
            this.trigger(ns.e.updateNode, {
                para: {
                    style: {
                        position: target.css("position"),
                        top: target.css("top"),
                        left: target.css("left")
                    }
                },
                el: this.attr.targetEl
            });
        }

        //we cant use ui-draggable be a target cause there are other element use it ,like sider paenl button
        //so we have to under parent selector to find it
        this.destroyDraggable = function() {
            $(this.attr.canvasSelector).find(this.attr.draggableSelector).draggable("destroy");
        };

        this.after("initialize", function() {
            //this.on(document, ns.e.command.uiDraggableDestroy, this.destroyDraggable);
            //this.on(document, ns.e.command.uiDraggableActivate, this.activateDraggable);

            //this.on(document, ns.e.canvas_clear_selection, this.destroyDraggable);
        });
    }
});
