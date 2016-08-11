/*
 * @Author: Vaninadh
 * @Date:   2016-03-23 16:37:11
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-14 17:46:33
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("../util/util")
    var ns = window.kc.ns;
    return defineComponent(droppable);

    function droppable() {

        this.attributes({
            canvasSelector: '.canvas',
            droppableSelector: '[kctype=container]'
        });
        this.activateDroppable = function(e, data) {
            /*if(data.el.attributes['kctype'].value=='container'){
                console.log(111);
                if(!$(data.el).is(':data(draggable)')){
                    $(data.el).droppable({
                       // greedy: true,
                        accept: util.getGlobalVar(ns.k.containerBtnSelector),
                        drop:this.dropBehaviour.bind(this)
                    });
                }
            }else{
                console.log(222);
                var parent=$(data.el).parent(this.attr.droppableSelector);
                if(!parent.is(':data(draggable)')){
                    parent.droppable({
                            //greedy: true,
                            accept: util.getGlobalVar(ns.k.containerBtnSelector),
                            drop:this.dropBehaviour.bind(this)
                        });
                }
            }*/
            $(this.attr.droppableSelector).droppable({
                accept: function(d){
                    if((d.attr("id")=="containerBtn")
                     ||(d.attr("id")=="imageBtn")
                     ||(d.attr("id")=="textBtn")
                     ||(d.attr("class").indexOf("temp-cell") > -1)
                     ||(d.attr("class").indexOf("temp-repe") > -1)
                     ||(d.attr("class").indexOf("item-draggable") > -1)){
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                drop:this.dropBehaviour.bind(this),
                greedy:"true"
            });

            //this.disableDroppable(e, data);
        };

        this.dropBehaviour = function(event, ui) {

            var eventtarget = event.target;
            var eventtoelement = event.toElement;
            var eventrelate = event.relatedTarget;

            // for test
            if (eventtarget != eventtoelement && eventtoelement.attributes.kctype == 'container') {
                return;
            }

            var clone = ui.helper.clone();
            var parent = $(eventtarget);


            var uileft = ui.offset.left;
            var uitop = ui.offset.top;

            var parentLeft= parent.offset().left;
            var parentTop= parent.offset().top;

            var dropLeft = uileft - parentLeft;
            var dropTop = uitop - parentTop;

            var baseV = dropTop;
            console.log(parent[0].attributes.direction.value);
            if (parent[0].attributes.direction.value == 'h') {
                baseV = dropLeft;
            }

            var closestOffset = Number.MAX_SAFE_INTEGER;
            var closestIdx = -1;
            var crossed = false;

            // now find the insert item
            for (var i = 0; i < parent[0].children.length; i++) {
                var tmpChild = parent[0].children[i];
                if (tmpChild.attributes == undefined || tmpChild.attributes.kctype == undefined) {
                    continue;
                }

                var tmpleft = $(tmpChild).position().left;
                var tmptop = $(tmpChild).position().top;
                var tmpwidth = $(tmpChild).width();
                var tmpheight = $(tmpChild).height();

                var base = tmptop;
                var offset = tmpheight;
                if (parent[0].attributes.direction.value == 'h') {
                    base = tmpleft;
                    offset = tmpwidth;
                }

                if (base < baseV && base + offset > baseV){
                    if (crossed) {
                        closestIdx = i;
                        continue;
                    }

                    if (baseV - base <  base + offset - baseV) {
                        if (i > 0) {
                            closestIdx = i-1;
                        }
                        else {
                            i =0;
                        }
                    }
                    else{
                        closestIdx = i;
                    }
                    crossed = true;
                }
                else{
                    if (base > baseV && !crossed) {
                        var diff = base - baseV;
                        if (diff < closestOffset) {
                            closestOffset = diff;
                            closestIdx = i;
                        }
                    }
                    else if ( base+offset < baseV && !crossed){
                        var diff = baseV - (base+offset);
                        if (diff < closestOffset) {
                            closestOffset = diff;
                            closestIdx = i;
                        }
                    }
                }
            }

            // if (closestIdx == -1 ) {
            //     clone.attr('preitem', "");
            // }
            // else{
            //     console.log(parent[0].children[closestIdx]);
            //     clone.attr('preitem', parent[0].children[closestIdx])
            // }
            clone.attr('preitem', closestIdx);


            //clone.css({ left: leftAdjust, top: topAdjust });
            clone.removeClass('tmpdrag ui-draggable-dragging');
            clone.addClass('kc-dashed');

            this.dataResolve(clone, eventtarget);
        }

        //data resolve
        //gevent.command.dataDroppable have not writed
        this.dataResolve = function(clone, eventtarget) {
            // construct styleobj here
            var styleobj = {};
            if (clone.attr("attrheight") != undefined) {
                styleobj['height'] = clone.attr("attrheight");
            }
            if (clone.attr("tposition") != undefined) {
                styleobj['position'] = clone.attr("tposition");
            }
            // TODO add more style

            var paraObj = {};
            paraObj['style']=styleobj;

            if (clone.attr("src") != undefined) {
                paraObj['src'] = clone.attr("src");
            }

            if (clone.attr("data-id") != undefined) {
                if (clone.attr("targettype") == "template") {
                    paraObj['tid'] = clone.attr("data-id");
                }

                if (clone.attr("targettype") == "inline") {
                    paraObj['bid'] = clone.attr("data-id");
                }
            }

            if (clone.attr("url") != undefined) {
                if (clone.attr("targettype") == "ext") {
                    paraObj['url'] = clone.attr("url");
                }
            }

            if (clone.attr("key") != undefined) {
                if (clone.attr("targettype") == "ext") {
                    paraObj['key'] = clone.attr("key");
                }
            }

            // TODO add more attrs

            this.trigger(ns.e.createNode, {
                itemtype: clone.attr("targettype"),
                para : paraObj,
                el:eventtarget,
                preel: clone.attr("preitem"),
            });
        };

        this.destroyDroppable = function(e, data) {
            $(".ui-droppable").droppable("destroy");
        };

        this.enableDroppable = function(e, data) {
            $(".ui-droppable").droppable("enable");
        };

        this.disableDroppable = function(e, data) {
            $(".ui-droppable").droppable("disable");
        };

        this.after("initialize", function() {
            this.on(document, ns.e.command.uiDroppableActivate, this.activateDroppable);
            this.on(document, ns.e.command.uiDroppableDestroy, this.destroyDroppable);
            this.on(document, ns.e.command.uiDroppableEnable, this.enableDroppable);
            this.on(document, ns.e.command.uiDroppableDisable, this.disableDroppable);
        });
    }
});
