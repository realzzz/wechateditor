

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("../util/util");
    var ns = window.kc.ns;
    return defineComponent(text);

    function text() {
        this.attributes({
            targetClass: '.kc-editable',
        });

        this.compositionstart = function compositionstart() {
            //console.log("compostion start event detected !");
            util.setGlobalVar(window.kc.ns.k.text_ignore_input, true);
        };

        this.compositionend = function compositionend() {
            //console.log("compostion end event detected !");
            util.setGlobalVar(window.kc.ns.k.text_ignore_input, false);
        };

        this.copySelectionStyle = function copySelectionStyle(e, data){
            var copyStyle = {};
            var textitem = $(data.kcpath)[0];
            // first copy the text item style
            var style = textitem.attributes['style'];
            if (style && style.value) {
                var styleStr = style.value;
                copyStyle = util.constructSytleFromString(styleStr);
            }

            // then walk through selections and
            var selectionStart = util.getGlobalVar(window.kc.ns.k.text_current_selection_start);
            var selectionEnd = util.getGlobalVar(window.kc.ns.k.text_current_selection_end);

            var children = textitem.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                // judge for the selection
                var shouldBeConsidered = false;

                if (child.tagName === 'SPAN') {
                    var range = child.attributes['range'].value;
                    var rangeArray = range.split('-');
                    if(rangeArray.length == 2){
                        var rStart = parseInt(rangeArray[0]);
                        var rEnd = parseInt(rangeArray[1]);
                        for (var j = selectionStart; j < selectionEnd; j++) {
                            if (j>= rStart && j<rEnd) {
                                shouldBeConsidered = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldBeConsidered){
                    var itemstyle = child.attributes['style'];
                    if (itemstyle && itemstyle.value) {
                        var itemStyleStr = itemstyle.value;
                        var itemStyleObj = util.constructSytleFromString(itemStyleStr);
                        // merge into current style
                        util.mergeObjects(copyStyle, itemStyleObj);
                    }
                }
            }

            // now save it
            var copyStyleKeys = Object.keys(copyStyle);
            if (copyStyleKeys.length > 0) {
                util.setGlobalVar(ns.k.text_current_selection_style, copyStyle);
                this.trigger(ns.e.textStyleCopided);
            }
        }

        this.checkShortCut = function checkShortCut(event, data){
            // handle left/up
            if (event!= null && (event.keyCode == 37 || event.keyCode == 38)) {
                // check current selection
                var curstart = util.getGlobalVar(ns.k.text_current_selection_start);
                var curend = util.getGlobalVar(ns.k.text_current_selection_end);
                if (curstart == 0 && curend== 0) {
                    event.preventDefault();
                    event.stopPropagation();
                    // let's focus on previous text element
                    var preElement = data.el.previousElementSibling;
                    while (preElement && preElement.attributes['kctype'].value !== 'text') {
                        preElement = preElement.previousElementSibling;
                    }
                    if (preElement && preElement.attributes['kctype'].value === 'text') {
                        // give focus to this element
                        var preChilds = preElement.children;
                        var lastChild = undefined;
                        var textlength = 0;
                        for (var i = 0; i < preChilds.length; i++) {
                            var tmpNode = preChilds[i];
                            if (tmpNode.tagName == 'SPAN') {
                                lastChild = tmpNode;
                            }

                            textlength += lastChild.innerText.length;
                        }
                        this.trigger(ns.e.canvas_clear_selection)
                        var range = document.createRange();
                        var length = lastChild.innerText.length;
                        range.selectNode(lastChild.childNodes[0]);
                        range.setStart(lastChild.childNodes[0], length);
                        range.collapse(true);
                        //range.setEnd(endNode, endoffset);
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);

                        util.setGlobalVar(window.kc.ns.k.text_current_selection_start, textlength);
                        util.setGlobalVar(window.kc.ns.k.text_current_selection_end, textlength);

                    }
                    return;
                }
            }

            // handle right/down
            if (event!= null && (event.keyCode == 39 || event.keyCode == 40)) {
                var textNodesArrayOri = data.el.children;
                var textLength = 0;
                for (var i = 0; i < textNodesArrayOri.length; i++) {
                    var node = textNodesArrayOri[i];
                    if(node.tagName=='SPAN') {
                        var range = node.attributes['range'].value;
                        var rangeArray = range.split('-');
                        if(rangeArray.length == 2){
                            var rStart = parseInt(rangeArray[0]);
                            var rEnd = parseInt(rangeArray[1]);
                            textLength = rEnd;
                        }
                    }
                }
                var curstart = util.getGlobalVar(ns.k.text_current_selection_start);
                var curend = util.getGlobalVar(ns.k.text_current_selection_end);

                if (curstart == textLength && curend == textLength) {
                    event.preventDefault();
                    event.stopPropagation();
                    // let's focus on next text element
                    var nextElement = data.el.nextElementSibling;
                    while (nextElement && nextElement.attributes['kctype'].value !== 'text') {
                        nextElement = nextElement.nextElementSibling;
                    }
                    if (nextElement && nextElement.attributes['kctype'].value === 'text') {
                        // give focus to this element
                        var nextChilds = nextElement.children;
                        var firstChild = undefined;
                        var textlength = 0;
                        for (var i = 0; i < nextChilds.length; i++) {
                            var tmpNode = nextChilds[i];
                            if (tmpNode.tagName == 'SPAN') {
                                firstChild = tmpNode;
                                break;
                            }
                        }
                        this.trigger(ns.e.canvas_clear_selection)
                        var range = document.createRange();
                        var length = firstChild.innerText.length;
                        range.selectNode(firstChild.childNodes[0]);
                        range.setStart(firstChild.childNodes[0], 0);
                        range.collapse(true);
                        //range.setEnd(endNode, endoffset);
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);

                    }
                    return;
                }
            }

            // handle enter key
            if (event!= null && event.keyCode == 13) {
                event.preventDefault();
                // trigger a new text item input
                var children = data.el.parentNode.children;
                var idx = -1;
                for (var i = 0; i < children.length; i++) {
                    if(data.el == children[i]) {
                        idx = i;
                        break;
                    }
                }
                this.trigger(ns.e.createNode, {
                    itemtype:"text",
                    para : {},
                    el:data.el.parentNode,
                    preel: idx,
                    respEvent: ns.e.goFocusOnLastEmptyTextOnCanvas
                });
                return;
            }
        }

        this.getSelectionHtml = function getSelectionHtml(event, data) {


            if (util.getGlobalVar(window.kc.ns.k.text_ignore_input)) return;

            var html = "";
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        var curRange = sel.getRangeAt(i);
                        var startcontainer = curRange.startContainer;
                        var startoffset = curRange.startOffset;
                        var endcontainer = curRange.endContainer;
                        var endoffset = curRange.endOffset;
                        var startnodeid = startcontainer.parentElement.getAttribute('rawid');
                        var endnodeid = endcontainer.parentElement.getAttribute('rawid');

                        //console.log("startnodeid startoffset" + startnodeid + " "+ startoffset);

                        if (startnodeid == undefined) {
                            // well - i've tried all the way I can think of but it simply should not suport line break for text input

                            // this means everything is broken
                            util.setGlobalVar(window.kc.ns.k.text_current_selection_start, startoffset);
                            util.setGlobalVar(window.kc.ns.k.text_current_selection_end, endoffset);

                        } else {
                            // or id exists let's make usage of them -> first thing is to find the parents holding all of you
                            var commonParent = startcontainer.parentElement.parentElement;
                            var childArray = commonParent.children;
                            var textLength = 0;
                            for (var j = 0; j < childArray.length; j++) {
                                var tmpChild = childArray[j];
                                if (tmpChild.getAttribute('rawid') === startnodeid) {
                                    util.setGlobalVar(window.kc.ns.k.text_current_selection_start, textLength + startoffset);
                                }
                                if (tmpChild.getAttribute('rawid') === endnodeid) {
                                    util.setGlobalVar(window.kc.ns.k.text_current_selection_end, textLength + endoffset);
                                    break;
                                }
                                textLength += tmpChild.innerText.length;
                            }

                            // apply copied styles if exists
                            copiedStyle = util.getGlobalVar(ns.k.text_current_selection_style);
                            var newStartOffSet = util.getGlobalVar(ns.k.text_current_selection_start);
                            var newEndOffSet = util.getGlobalVar(ns.k.text_current_selection_end);

                            //console.log("newStartOffSet " + newStartOffSet);

                            if (copiedStyle != undefined) {
                                if (newStartOffSet != newEndOffSet) {
                                    var copiedStyleKeys = Object.keys(copiedStyle);
                                    if (copiedStyleKeys.length > 0) {
                                        var textStyleChangeObj = {};
                                        var crkey = newStartOffSet + "-" + newEndOffSet;
                                        textStyleChangeObj[crkey] = copiedStyle;

                                        this.trigger(ns.e.updateNode, {
                                            para: {
                                                "chtrstyle":textStyleChangeObj
                                            },
                                            el: data.el
                                        });
                                    }
                                }
                                util.removeGlobarVar(window.kc.ns.k.text_current_selection_style);
                                this.trigger(window.kc.ns.e.textCopyStyleClear);
                            }

                        }
                        //console.log("currentSelectionStart" + util.getGlobalVar(window.kc.ns.k.text_current_selection_start));
                        //console.log("currentSelectionEnd" + util.getGlobalVar(window.kc.ns.k.text_current_selection_end));
                    }
                }
            } else if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                    // WTH am i trying to do here?
                }
            }

        };


        this.getInput = function getInput(event) {
            if (util.getGlobalVar(window.kc.ns.k.text_ignore_input)) return;

            var oldSelectStart = util.getGlobalVar(window.kc.ns.k.text_current_selection_start);
            var oldSelectEnd = util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
            //console.log("oldSelectStart" + oldSelectStart);
            //console.log("oldSelectEnd" + oldSelectEnd);
            this.getSelectionHtml(null);

            var curSelectStart = util.getGlobalVar(window.kc.ns.k.text_current_selection_start);
            var curSelectEnd = util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
            if (curSelectStart == curSelectEnd) {
                // iterate through items to get the data
                var parentElement = event.target;
                var updateContent = "";
                var textLength = 0;
                var textNodesArrayOri = parentElement.children;
                var textNodesArray = [];
                for (var i = 0; i < textNodesArrayOri.length; i++) {
                    var node = textNodesArrayOri[i];
                    if(node['nodeName']=='span') {textNodesArray.push(node);}
                }
                var metStart = false,
                    metEnd = false;
                if (oldSelectStart == curSelectStart) {
                    // it's a remove operation
                    updateContent = "";
                } else if (curSelectStart < oldSelectStart) {
                    // back space operation
                    updateContent = "";
                    oldSelectStart = curSelectStart;
                } else {
                    // should be oldSelectStart > currentSelectionStart, it's a replace operation
                    if (textNodesArray.length == 0) {
                        updateContent += parentElement.innerText.substring(oldSelectStart, curSelectEnd);
                    } else {
                        for (var i = 0; i < textNodesArray.length; i++) {
                            var node = textNodesArray[i];
                            var text = node.innerText;
                            if (textLength + text.length - 1 >= oldSelectStart && !metStart) {
                                metStart = true;
                                if (textLength + text.length >= gcurSelectEnd) {
                                    metEnd = true;
                                    updateContent += text.substring(oldSelectStart - textLength, curSelectEnd - textLength);
                                    break;
                                } else {
                                    updateContent += text.substring(oldSelectStart - textLength);
                                }
                            }

                            if (metStart) {
                                if (textLength + text.length >= curSelectEnd && !metEnd) {
                                    metEnd = true;
                                    updateContent += text.substring(0, curSelectEnd - textLength);
                                    break;
                                } else {
                                    updateContent += text;
                                }
                            }
                            textLength += text.length;
                        }
                    }
                }

                var textChangeObj = {};
                var crkey = oldSelectStart + "-" + oldSelectEnd;
                textChangeObj[crkey] = updateContent;
                // todo make the opaid and kc path correct
                //console.log("updateing node " + crkey + " " + updateContent);
                this.trigger(window.kc.ns.e.updateNode, {
                    para: {
                        textchange: textChangeObj
                    },
                    el: event.currentTarget, // not sure if this is the right way
                    respEvent: window.kc.ns.e.event_text_changed
                });
            }
        };

        this.insertSymbol = function(event, data){
            var symbol = data.symbol;

            var curSelectStart = util.getGlobalVar(window.kc.ns.k.text_current_selection_start);
            var curSelectEnd = util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
            var textChangeObj = {};
            var crkey = curSelectStart + "-" + curSelectEnd;
            textChangeObj[crkey] = symbol;
            // todo make the opaid and kc path correct
            //console.log("updateing node " + crkey + " " + updateContent);
            this.trigger(window.kc.ns.e.updateNode, {
                para: {
                    textchange: textChangeObj
                },
                kcpath: data.kcpath,
                respEvent: window.kc.ns.e.event_text_changed
            });

            util.setGlobalVar(window.kc.ns.k.text_current_selection_start, curSelectStart+1);
            util.setGlobalVar(window.kc.ns.k.text_current_selection_end, curSelectEnd+1);
        }

        this.restoreSelection = function(event, data){
            var curSelectStart = util.getGlobalVar(window.kc.ns.k.text_current_selection_start);
            var curSelectEnd = util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
            if (curSelectStart > -1 && curSelectEnd > -1){
                var ts = util.kcpathToSelector(data.path, window.kc.ns.c.canvasClass + ' > ' +  window.kc.ns.c.rootContainer);
                var mainDiv = $(ts).first()[0];
                if(mainDiv != undefined){
                    var length = 0;
                    var startNode = undefined;
                    var endNode;
                    var startoffset =0 ;
                    var endoffset = 0;
                    if (mainDiv.children.length > 0 ) {
                        for (var i = 0; i < mainDiv.children.length; i++) {
                            var child = mainDiv.children[i];
                            var text = child.innerText;
                            if (length + text.length > curSelectStart && startNode == undefined){
                                startNode = child.firstChild;
                                startoffset = curSelectStart-length;
                            }
                            if (length + text.length >curSelectEnd){
                                endNode = child.firstChild;
                                endoffset = curSelectEnd-length;
                                break;
                            }
                            length += text.length;

                            if(i+1 ==  mainDiv.children.length){
                                if (startNode == undefined){
                                    startNode = child.firstChild;
                                    startoffset = text.length;
                                }
                                if (endNode == undefined){
                                    endNode = child.firstChild;
                                    endoffset = text.length;
                                }
                            }
                        }
                    }
                    else{
                        startNode = mainDiv.firstChild;
                        startoffset = curSelectStart;
                        endNode = mainDiv.firstChild;
                        endoffset = curSelectEnd;
                    }

                    if (startNode != undefined && endNode != undefined){
                        var range = document.createRange();
                        range.selectNode(startNode);
                        range.setStart(startNode, startoffset);
                        range.collapse(true);
                        //range.setEnd(endNode, endoffset);
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
        }



        // TODO add handle for restore
        this.after('initialize', function() {
            this.on("compositionstart", {
                'targetClass': this.compositionstart
            });

            this.on("compositionend", {
                'targetClass': this.compositionend
            });

            this.on("keyup mouseup", {
                'targetClass': this.getSelectionHtml
            });

            this.on("keydown mousedown", {
                'targetClass': this.checkShortCut
            });

            this.on("input", {
                'targetClass': this.getInput
            });

            this.on(window.kc.ns.e.event_text_changed, this.restoreSelection);

            this.on(window.kc.ns.e.textCopyStyle, this.copySelectionStyle);

            this.on(window.kc.ns.e.textinsertsymbol, this.insertSymbol);
        });
    }
});
