/*
 * @Author: Vaninadh
 * @Date:   2016-03-21 10:35:27
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-17 18:04:00
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("../util/util");
    var ns = window.kc.ns;
    return defineComponent(resize);

    function resize() {

        this.attributes({
            targetClass: '[kctype]',
            canvasSelector: '.canvas',
            handleImgSize: 25.45,
            boxPadding: 0,
            resizableSelector: '.ui-resizable',
            canvasSelector: '.canvas',
            wrapperSelector: '.ui-wrapper',
            handle:''
        });

        this.setContainment = function(data) {
            var parent = $(data.el).parent("[kctype=container]");

            if (parent.length > 0) {
                this.attr.containment = parent;
            } else {
                this.attr.containment = this.attr.canvasSelector;
            }
        }

        this.beforeActiveResize = function(e, data) {
            //$(data.el).css({ position: 'relative' });
            var kctype = $(data.el).attr('kctype');
            if (kctype == "image") {
                var imgchild = $(data.el).children('img');
                var w = imgchild.width();
                var h = imgchild.height();
                var cssObj = {};
                cssObj["width"]=w;
                cssObj["height"]=h;

                var estyle = "";
                if ($(data.el)[0].attributes.style) {
                    estyle = $(data.el)[0].attributes.style.value;
                }
                if (!util.checkStyleHasWidthAuto(estyle) && !util.checkStyleHasBorder(estyle)) {
                    $(data.el).css(cssObj);
                }
            }
        }

        this.reLocate = function(data) {
            var height = $(data.el).height() + this.attr.boxPadding;
            var width = $(data.el).width() + this.attr.boxPadding;
            // TODO TODO TODO, this is not excat w&h for certain templates, thus we need furture consideration here.
            this.locateHandle(width, height);
        }

        this.locateHandle = function(width, height) {

            $('.ui-resizable-s').css({
                top: height - this.attr.handleImgSize / 2,
                left: width / 2 - this.attr.handleImgSize / 2
            });
            $('.ui-resizable-e').css({
                top: height / 2 - this.attr.handleImgSize / 2,
                left: width - this.attr.handleImgSize / 2
            });
            $('.ui-resizable-w').css({
                top: height / 2 - this.attr.handleImgSize / 2,
                left: -this.attr.handleImgSize / 2
            });
            $('.ui-resizable-n').css({
                top: -this.attr.handleImgSize / 2,
                left: width / 2 - this.attr.handleImgSize / 2
            });
            $('.ui-resizable-se').css({
                top: height - this.attr.handleImgSize / 2,
                left: width - this.attr.handleImgSize / 2
            });
            //$('.ui-resizable-se').attr('contenteditable', false);
            $('.ui-resizable-sw').css({
                top: height - this.attr.handleImgSize / 2,
                left: -this.attr.handleImgSize / 2
            });
            $('.ui-resizable-ne').css({
                top: -this.attr.handleImgSize / 2,
                left: width - this.attr.handleImgSize / 2
            });
            $('.ui-resizable-nw').css({
                top: -this.attr.handleImgSize / 2,
                left: -this.attr.handleImgSize / 2
            });
        }

        this.activeResize = function(e, data) {
            this.destroyResize();
            this.attr.targetEl = data.el;
            this.setContainment(data);
            this.beforeActiveResize(e, data);

            if (this.attr.containment == this.attr.canvasSelector) {
                this.attr.handlesPara = 's';
                //this.attr.containment=false;
            } else {
                this.attr.handlesPara = 'sw, se';
                //this.attr.containment=false;
            }

            $(data.el).resizable({
                // ghost:true,
                //containment: this.attr.canvasSelector,
                handles: this.attr.handlesPara,
                start: this.startBehaviour.bind(this),
                resize: this.resizeBehaviour.bind(this),
                stop: this.stopBehaviour.bind(this)
            });

            //overflow is none can make the position point in the element outside

            $(this.attr.wrapperSelector).css({ overflow: '' });
            this.reLocate(data);
        };

        this.startBehaviour = function(event, ui) {
            //todo
        }

        this.resizeBehaviour = function(event, ui) {
            //var target=$(event.target);
            //console.log("h:"+target.height()+",w:"+target.width()+",top:"+target.css("top")+",left:"+target.css("left"));

            this.locateHandle(ui.size.width, ui.size.height);
        }

        this.stopBehaviour = function(event, ui) {
            this.locateHandle(ui.size.width, ui.size.height);

            var target = $(event.target);
            //var left = (100 * parseFloat(target.css("left")) / parseFloat(target.parent().css("width"))) + "%";
            //var top = (100 * parseFloat(target.css("top")) / parseFloat(target.parent().css("height"))) + "%";
            //target.css("left", left);
            //target.css("top", top);

            this.trigger(window.kc.ns.e.updateNode, {
                para: {
                    style: {
                        position: target.css("position"),
                        top: target.css("top"),
                        left: target.css("left"),
                        width: ui.size.width + 'px',
                        height: ui.size.height + 'px'
                    }
                },
                // TODO -> is this correct?
                el: this.attr.targetEl,
                respEvent: ns.e.resp.resize_node_update
            });
            //target.css({"background-color":this.attr.background});
            //ui.element.css('overflow','auto');
        }

        this.destroyResize = function() {
            //$('.ui-resizable').css({ position: '' });
            $(this.attr.resizableSelector).resizable("destroy");
        };

        this.after("initialize", function() {
            this.on(document, ns.e.command.uiResizeActivate, this.activeResize);
            this.on(document, ns.e.command.uiResizeDestroy, this.destroyResize);
            this.on(document, ns.e.canvas_clear_selection, this.destroyResize);
        });
    }
});
