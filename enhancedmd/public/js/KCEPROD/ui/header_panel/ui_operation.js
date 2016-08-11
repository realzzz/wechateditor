/*
 * @Author: Vaninadh
 * @Date:   2016-03-29 12:00:16
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-09 11:03:43
 */
define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;
    return defineComponent(uiOperation);

    function uiOperation() {
        this.attributes({
            targetClass: '.canvas',
            articleOpPanel: '#artOpPanel',
            articleCopyBtn: '#copyArtBtn',
            articleListBtn: '#artListBtn',
            undoBtn: '#undoBtn',
            redoBtn: '#redoBtn',
            articlePreviewBtn: '#artPreviewBtn',
            articleClearBtn: '#artClearBtn',
            articleCrawlBtn: '#artCrawlBtn'
        });

        this.articleListOp = function() {
            var aid = util.getGlobalVar(window.kc.ns.k.current_article_id);
            if (!util.isEmptyStr(aid)) {
                this.trigger(window.kc.ns.e.article.uiArticleListActivate);
            }
        }

        this.articleCopyOp = function() {
            // first remove every class of kc-dashed kc-editable kc-over kc-container
            $('.kc-dashed').removeClass('kc-dashed');
            $('.kc-empty').removeClass('kc-empty');

            $('[kctype]').each(function(i, obj) {
                if($(this).attr('style')!= undefined){
                    console.log($(this).attr('style'));
                    var styles = $(this).attr("style");
                    var value;
                    if (styles) {
                        var styleArray = styles.split(";");
                        var needupdate = false;
                        for (var i = 0; i < styleArray.length; i++) {
                            var e = styleArray[i];
                            var style = e.split(":");
                            if ($.trim(style[0]) === 'width' || $.trim(style[0]) === 'height') {
                                value = style[1];
                                if (value.indexOf('px') > -1) {
                                    valuestr = value.substring(0, value.indexOf('px'));
                                    valueint = parseInt(valuestr);
                                    valueint = valueint * 0.7;
                                    valstr = $.trim(style[0]) + ': ' +valueint.toString() + 'px';
                                    styleArray[i] = valstr;
                                    needupdate =true;
                                }
                            }
                        }
                        if (needupdate) {
                            var styleupdate = styleArray.join(';');
                            $(this).attr('style', styleupdate)
                        }
                    }
                }
            });

            util.canvas2clipboard();
            this.trigger(window.kc.ns.e.event_canvas_copied);
        }

        this.artilePreviewOp = function() {
            var aid = util.getGlobalVar(window.kc.ns.k.current_article_id);
            if (!util.isEmptyStr(aid)) {
                this.trigger(window.kc.ns.e.article.uiAritclePrivew);
            }
        }

        this.articleClearOp = function() {
            console.log("articleClearOp");

            var me = this;
            this.trigger(ns.e.canvas.uiNotifyConfirm, {
                text: "确定要清空么?",
                confirmCallBk: function() {
                    var eventDataObj = {
                        el: me.attr.targetClass,
                        para: {},
                        respEvent: ns.e.article.uiArticlePrune
                    }
                    me.trigger(ns.e.pruneArticle, eventDataObj);
                }
            });
        }

        this.articleCrawlOp = function() {
            console.log("articleCrawlOp");
        }

        this.undo = function(){
            this.trigger(ns.e.articleUndoOp);
        }

        this.redo = function(){
            this.trigger(ns.e.articleRedoOp);
        }

        this.after('initialize', function() {
            this.on(document, 'click', {
                articleListBtn: this.articleListOp,
            });
            this.on(this.attr.articleOpPanel, 'click', {
                articleCopyBtn: this.articleCopyOp,
                articlePreviewBtn: this.artilePreviewOp,
                articleClearBtn:this.articleClearOp,
                articleCrawlBtn:this.articleCrawlOp,
                undoBtn: this.undo,
                redoBtn: this.redo
            });

        });
    }
})
