/*
 * @Author: Vaninadh
 * @Date:   2016-03-21 15:47:58
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-19 16:21:03
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;
    return defineComponent(select);

    function select() {
        this.attributes({
            hoverSelector: ".kc-dashed",
            hoverClass: "kc-hover",
            canvasSelector: ".canvas",
            targetSelector: ".kc-dashed",
            selectedClass: "kc-selected",
            selectedSelector: ".kc-selected"
        });
        this.mouseClick = function(e, data) {
            this.mouseSelectedClassClear();
            $(data.el).addClass(this.attr.selectedClass);
        }

        this.mouseHover = function(e, data) {
            var me = this;
            $(this.attr.canvasSelector).on('mouseenter', this.attr.hoverSelector, function(event) {
                $(me.attr.hoverClass).removeClass(me.attr.hoverClass);
                $(this).addClass(me.attr.hoverClass);
                event.stopPropagation();
            }).on('mouseleave', this.attr.hoverSelector, function(event) {
                $(this).removeClass(me.attr.hoverClass);
                event.stopPropagation();
            });
        }

        this.mouseSelectedClassClear = function() {
            $(this.attr.selectedSelector).removeClass(this.attr.selectedClass);
        }
        this.after("initialize", function() {
            this.mouseHover();

            this.on(this.attr.canvasSelector, "click", {
                targetSelector: this.mouseClick
            });

            this.on(document, ns.e.canvas_clear_selection, this.mouseSelectedClassClear);
        });
    }
});
