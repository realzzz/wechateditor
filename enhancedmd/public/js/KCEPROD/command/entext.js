/*
 * @Author: Vaninadh
 * @Date:   2016-04-05 17:30:52
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-05 17:49:33
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;

    return defineComponent(entext);

    function entext() {
        this.attributes({
            canvasSelector: ".canvas",
            targetClass: '[kctype="container"]',
        });

        this.mouseClick = function(e, data) {
            if (e.currentTarget != e.toElement) {
                return;
            }

            var targetEl = $(data.el);
            var kcpath = util.constructKcPath(targetEl.context);

            if (kcpath === "") {
                // detect if hits the bottom of container
                var maxheight = 0;
                var rootCon = targetEl[0];
                var lastChild = undefined;
                var lastIdx = -1;

                // if the last item is an empty text then focus on it

                for (var i = 0; i < rootCon.children.length; i++) {
                    var tmpChild = rootCon.children[i];
                    // actually this is not going to happen
                    if (tmpChild.className != undefined && tmpChild.className.indexOf("ui-resizable-handle")>-1) {
                        continue;
                    }
                    var offsetHeight = $(tmpChild).position().top;
                    var itemHeight = $(tmpChild).height();
                    if (offsetHeight + itemHeight > maxheight) {
                        maxheight = offsetHeight + itemHeight;
                    }

                    lastChild = tmpChild;
                    lastIdx = i;
                }

                if (lastChild != undefined && lastChild.attributes["kctype"].value === "text") {
                    var isEmpty = true;
                    for (var j = 0; j < lastChild.children.length; j++) {
                        var tmpSpan = lastChild.children[j];
                        if (tmpSpan.className != undefined && tmpSpan.className.indexOf("ui-resizable-handle")>-1) {
                            continue;
                        }
                        if (tmpSpan.innerText != undefined && tmpSpan.innerText.length > 0) {
                            isEmpty = false;
                            break;
                        }
                    }
                    if (isEmpty) {
                        this.trigger(ns.e.goFocusOnLastEmptyTextOnCanvas, {el:lastChild});
                        return;
                    }
                }

                if (maxheight == 0 || e.pageX > maxheight) {
                    // trigger the creation of text
                    var targetPath = "";
                    if (lastChild !== undefined) {
                        targetPath = util.constructKcPath(lastChild);
                    }

                    this.trigger(ns.e.createNode, {
                        itemtype:"text",
                        para : {},
                        el:data.el,
                        preel: lastIdx,
                        respEvent: ns.e.goFocusOnLastEmptyTextOnCanvas
                    });

                }
            }
        }

        this.focusOnLastEmptyTextOfCanvas = function (e, data){
            var node = $(data.el)[0];
            node.click();
            if (node != undefined) {
                var range = document.createRange();
                range.selectNode(node);
                range.setStart(node, 0);
                range.collapse(true);
                //range.setEnd(endNode, endoffset);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

        this.after("initialize", function() {
            this.on(this.attr.canvasSelector, "click", {
                targetClass: this.mouseClick
            });

            this.on(document, ns.e.goFocusOnLastEmptyTextOnCanvas, this.focusOnLastEmptyTextOfCanvas);
        });
    }
});
