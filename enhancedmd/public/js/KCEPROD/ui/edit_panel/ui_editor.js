/*
 * @Author: Vaninadh
 * @Date:   2016-03-29 12:00:16
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-20 16:49:42
 */
define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;
    return defineComponent(uiEditor);

    function uiEditor() {
        this.attributes({
            loadonce: false,
            targetClass: '[kctype]',
            canvasSelector: ".canvas",
            titleInput: '#a-title-input',
            descInput: '#a-desc-input'
        });

        this.renderCanvas = function(e, data) {
            $(this.attr.canvasSelector).html(data.html);
            $(this.attr.titleInput)[0].value = data.title;
            $(this.attr.descInput)[0].value = data.description;
            util.setGlobalVar(window.kc.ns.k.current_article_id, data.articleid);
            this.trigger(document, ns.e.command.uiDroppableActivate);
        }

        this.mouseClick = function(e, data) {
            //resize must be front of the draggabel .cause resize change may add a div.ui-wrapper
            this.trigger(ns.e.command.uiResizeActivate, data);
            this.trigger(ns.e.command.uiDraggableActivate, data);
            this.trigger(ns.e.command.uiDeleteableActivate, data);
            //this.trigger(ns.e.command.uiSortableActivate, data);
            
            this.trigger(ns.e.property.uiPropertyCenterDispatch, data);
        }

        this.activateCanvas=function(){
            if (!this.attr.loadonce) {
                this.attr.loadonce = true;
            }
        }

        this.after('initialize', function() {
            this.on(this.attr.canvasSelector, "click", {
                targetClass: this.mouseClick
            });
            this.on(document, ns.e.canvas.uiRenderCanvas, this.renderCanvas);
        });
    }
})