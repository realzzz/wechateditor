/*
 * @Author: Vaninadh
 * @Date:   2016-03-30 16:01:52
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-07 15:00:00
 */
define(function(require) {
    var ns = window.kc.ns;
    return mixinButtonDraggable;

    function mixinButtonDraggable() {
        this.attributes({
            mouseoverTarget:'[kctype]',
            canvasSelector:'.canvas'
        });

        this.activeBtnDraggable = function() {
            this.$node.draggable({
                helper: this.helperElm.bind(this),
                revert: "invaild",
                start: this.startBehaviour.bind(this),
                stop: this.stopBehaviour.bind(this),
                snap: this.attr.canvasSelector,
                snapMode: "inner",
                snapTolerance: 2,
                cursor: "move"
            });
        };

        this.startBehaviour = function(event, ui) {
            //this.trigger(ns.e.command.uiDroppableActivate);
            this.trigger(ns.e.command.uiDroppableEnable);
            /*this.on(this.attr.canvasSelector,'mouseover',{
                mouseoverTarget:this.droppableMouseover
            })*/
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
