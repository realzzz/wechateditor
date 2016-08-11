/*
 * @Author: Vaninadh
 * @Date:   2016-04-11 15:50:06
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-25 11:05:55
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiCellMixinDraggable = require("KCEPROD/ui/sider_panel/cell/ui_cell_mixin_draggable");

    var Mustache = require("mustache");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    return defineComponent(uiCellMixinDraggable, uiTabPanelCollectProduce);

    function uiTabPanelCollectProduce() {
        this.attributes({
            loadonce: false,
            produceBtnSelector: "#collect-produce-btn",
            produceTabSelector: "#collect-produce-tab",
            produceBoxSelector: "#collect-produce-box",
            produceDialog: '',
            listType: "inlineblock",
            pasterArea: '#pasterArea',
            previewArea: '#previewArea',
            productSaveBtn: '#productSaveBtn',
            productPopupClose: '#productPopupClose',
            pageid: 0,
            cellInlineblockSelector: ".collect-inlineblock-cell",
            itemDraggable:".item-draggable",
            itemOpDeleteSelector: ".icon-shanchu",
            produceDialogSelector:"#uiTabPanelCollectProduce"
        });

        this.renderTab = function(e, data) {
            if (!this.attr.loadonce) {
            	console.log("render uiTabPanelCollectProduce is ok!");

            	var that = this;
                $('body').append(this.getDialog());

                this.attr.produceDialog = $("#uiTabPanelCollectProduce").dialog({
                    closeOnEscape:false,
                    create: function(event) {
                        $(event.target).dialog("widget").css({ "position": "fixed" });
                    },
                    resizable: false,
                    height: 400,
                    width: 600,
                    modal: true,
                    show: "fade",
                    hide: "fade",
                    position: { my: "top", at: "bottom", of: $('#artOpPanel') },
                    dialogClass: '',
                    autoOpen: false
                });
                //dialog init
                this.on(this.attr.pasterArea, "input", this.onPasterInput);
                //
                this.on(this.attr.produceTabSelector, "click", {
                    produceBtnSelector: this.dialogOpen
                });

                this.on(this.attr.produceDialogSelector, "click", {
                    productPopupClose:this.closeDialog,
                    productSaveBtn:this.saveContent
                });

                this.renderInlineblockListScroll();

                this.addBoxListener();

                this.attr.loadonce = true;
            }
        }

        this.addBoxListener = function() {
            var that = this;

            $(this.attr.loveBoxSelector).scroll(function() {
                var $this = $(this);
                var height = this.scrollHeight - $this.height() - 50; // Get the height of the div
                var scroll = $this.scrollTop(); // Get the vertical scroll position

                var isScrolledToEnd = (scroll >= height);

                if (isScrolledToEnd) {
                    that.renderInlineblockListScroll();
                }
            });

            this.on(this.attr.produceBoxSelector, 'click', {
                itemOpDeleteSelector: this.itemOpDelete
            });


        }

        this.clearInlineBlockInBox=function(){
        	this.attr.pageid = 0;
            $(this.attr.produceBoxSelector).html("");
        }


        this.itemOpDelete = function(e, data) {
            var cid = $(data.el).parent().data('id');
            this.trigger(ns.e.data.dataInlineblockCollectDelete, {
                cid: cid,
                el: data.el
            });
        };

        this.renderInlineblockListScroll = function() {
            this.trigger(ns.e.data.dataInlineblockCollectList, {
                type: this.attr.listType,
                pageid: this.attr.pageid
            });
            this.attr.pageid++;
        }

        this.dialogOpen = function(e, data) {
            $(this.attr.pasterArea).html("");
            $(this.attr.previewArea).html("");
            util.displayGrayBg();
            this.attr.produceDialog.dialog("open");
        }

        this.closeDialog = function() {
            this.attr.produceDialog.dialog("close");
            util.hideGrayBg();
        }

        this.onPasterInput = function() {
            var inputv = $(this.attr.pasterArea).html();
            console.log(inputv);
            var thisRef = this;

            // TODO move to some where else, now simply put here
            $.ajax({
                type: "POST",
                url: "/getInlineblock",
                data: JSON.stringify({ content: inputv }),
                contentType: "application/json; charset=utf-8",
                dataType: "html",
                success: function(result) {
                    var resultObj = JSON.parse(result);
                    if (resultObj["result"] === "0") {
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"');
                        $(thisRef.attr.previewArea).html(renderHtml);
                    } else {
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation] = "render inlinblock";
                        errData[window.kc.ns.k.error_message] = "network success but render failure";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation] = "render inlinblock";
                    errData[window.kc.ns.k.error_message] = "failure";
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                    return;

                }
            });


        }

        this.saveContent = function() {
            var inputv = $(this.attr.pasterArea).html();
            var uid = util.getGlobalVar(window.kc.ns.k.current_user_id);

            if (util.isEmptyStr(inputv)) {
                return;
            }
            var thisRef = this;
            // actually this shall goto user module, but what ever ....
            $.ajax({
                type: "POST",
                url: "/users/addUserCollection",
                data: JSON.stringify({ orihtml: inputv, userid: uid }),
                contentType: "application/json; charset=utf-8",
                dataType: "html",
                success: function(result) {
                    var resultObj = JSON.parse(result);
                    if (resultObj["result"] === "0") {
                        // TODO
                        thisRef.trigger(document, window.kc.ns.e.tab.uiInlineblockCollectRefresh);
                        thisRef.closeDialog();
                    } else {
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation] = "render inlinblock";
                        errData[window.kc.ns.k.error_message] = "network success but render failure";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation] = "render inlinblock";
                    errData[window.kc.ns.k.error_message] = "failure";
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                    return;
                }
            });
        }

        this.getDialog = function() {
            return [
                //'<div id="uiTabPanelCollectProduce">',
                //'<div id="pasterArea" class="bgGray" contenteditable="true" style="float:left; width:400px; height:100%"></div>',
                //'<div id="previewArea" class="bgGray" style="float:left; width:400px; height:100%"></div>',
                //'</div>',
                '<div id="uiTabPanelCollectProduce" class="popContent10 displayT"> \
            		<img id="productPopupClose" src="images/p3_7.png" class="popClose" />\
            		<div class="pd20 displayTC">\
            			<div class="font16 colorBlack">我的制作</div>\
            			<div class="bgWhite1 pt20 pb20">\
            				<div id="pasterArea" contenteditable="true" class="textarea1 borderR5 width6 descTextarea1 bgGray2 pd10 borderR5 font14 colorGray1" >复制粘贴你想要输入的内容</div>\
            			</div>\
            			<div class="textC pt10">\
            				<a id="productSaveBtn" class="displayI bgYellow font16 colorWhite pt5 pb5 pl30 pr30">保存</a>\
            			</div>\
            		</div>\
            		<div class="bgGray3 pd20 displayTC borderTR5 borderBR5">\
            			<div class="displayI font14 colorGray border1 pt5 pb5 pl10 pr10">预览</div>\
            			<div id="previewArea" class="width6">\
            			</div>\
            		</div>\
            	</div>'
            ].join('\n');
        }

        this.getTmpl = function() {
            return [
                '{{#objs}}',
                '<div class="item-draggable" data-id="{{targetid}}" style="position:relative;width:280px;border-bottom:solid #dddddd;" targettype="inline">',
                '<div class="item-op-center" data-id="{{id}}">',
                '<i class="iconfont icon-shanchu"/>',
                '</div>',
                '<div class="collect-inlineblock-cell cell-list" style="width:280px">',
                '{{{html}}}',
                '</div>',
                '</div>',
                '{{/objs}}',
            ].join('\n');
        }

        //callback when server send json data to client
        this.renderInlineblockCollectList = function(e, data) {
            $(this.attr.produceBoxSelector).append(Mustache.render(this.getTmpl(), data.json));
            this.activeDraggable($(this.attr.itemDraggable));
        }

        this.renderInlineblockCollectDelete = function(e, data) {
            $(data.el).parent().parent().remove();
        }

        this.renderInlineBlockRefresh = function(){
        	if(this.attr.loadonce){
	            this.clearInlineBlockInBox();
	            this.renderInlineblockListScroll();
            }
        }

        this.after("initialize", function() {
            console.log("uiTabPanelCollectProduce is ok!");
            this.on(document, ns.e.tab.uiCollectTabProduce, this.renderTab);
            this.on(document, ns.e.tab.uiInlineblockCollectList, this.renderInlineblockCollectList);
            this.on(document, ns.e.tab.uiInlineblockCollectRefresh, this.renderInlineBlockRefresh);
            this.on(document, ns.e.tab.uiInlineblockCollectDelete, this.renderInlineblockCollectDelete);
        });
    }
});
