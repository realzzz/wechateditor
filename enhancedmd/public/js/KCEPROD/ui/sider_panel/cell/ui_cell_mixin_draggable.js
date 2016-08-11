/*
* @Author: Vaninadh
* @Date:   2016-04-12 19:40:44
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-04-14 17:23:55
*/

define(function(require) {
    var ns = window.kc.ns;
    return uiCellMixinDraggable;

    function uiCellMixinDraggable() {
        this.attributes({
            mouseoverTarget:'[kctype]',
            canvasSelector:'.canvas'
        });

        this.activeDraggable = function(node) {
            node.draggable({
                helper:  "clone",
                start: this.startBehaviour.bind(this),
                stop: this.stopBehaviour.bind(this),
                snap: this.attr.canvasSelector,
                snapMode: "inner",
                snapTolerance: 2,
                cursor: "move"
            });
        };

        this.startBehaviour = function(event, ui) {
            this.trigger(ns.e.command.uiDroppableEnable);
        };
        this.stopBehaviour = function(event, ui) {
            this.trigger(ns.e.command.uiDroppableDisable);
            $(ui.helper).remove();
            //this.off(this.attr.canvasSelector,'mouseover');

        };

        this.droppableMouseover=function(e,data){
            this.trigger(ns.e.command.uiDroppableActivate,data);
        }
    };
});