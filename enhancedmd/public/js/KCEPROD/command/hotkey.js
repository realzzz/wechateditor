/*
 * @Author: Vaninadh
 * @Date:   2016-03-21 15:47:58
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-03-31 18:09:48
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    return defineComponent(hotkey);

    function hotkey() {
        this.attributes({
            ctrlDown:false,
            shiftDown:false,
            ctrlKey:17,
            shiftKey:16,
            zKey:90,
            vKey:86,
            containerSel:'[kctype="container"]',
        });

        this.handleKeyDown = function (e, data){
            if (e.keyCode == this.attr.ctrlKey) {
                this.attr.ctrlDown = true;
            }

            if (e.keyCode == this.attr.shiftKey) {
                this.attr.shiftDown = true;
            }
        }

        this.handleKeyUp = function (e, data){
            if (e.keyCode == this.attr.ctrlKey) {
                this.attr.ctrlDown = false;
            }

            if (e.keyCode == this.attr.shiftKey) {
                this.attr.shiftDown = false;
            }

            if (e.keyCode == this.attr.zKey){
                if (this.attr.ctrlDown && this.attr.shiftDown) {
                    // redo
                    this.trigger(ns.e.articleRedoOp);
                }
                else if (this.attr.ctrlDown) {
                    // undo
                    this.trigger(ns.e.articleUndoOp);
                }
            }
        }

        this.pasteOnContainer = function(e, data){
            e.preventDefault();
            var text = (e.originalEvent || e).clipboardData.getData('text/html');
            console.log(text);
            var lastChild=-1;
            for (var i = 0; i < data.el.children.length; i++) {
                var tmpchild = data.el.children[i];
                if (tmpchild.attributes.kcpath != undefined ) {
                    lastChild = i;
                }
            }
            var insertpath = util.constructKcPath(data.el);
            this.trigger(ns.e.insertInlineblock, {kcpath: data.el, preel: lastChild, content:text});
        }


        this.after("initialize", function() {

            this.on(document, "keydown", this.handleKeyDown);
            this.on(document, "keyup", this.handleKeyUp);
            this.on(document, 'paste', {containerSel:this.pasteOnContainer});

        });
    }
});
