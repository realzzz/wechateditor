/*
 * @Author: Vaninadh
 * @Date:   2016-03-30 19:51:31
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-27 11:31:12
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiCellMixinDraggable = require("KCEPROD/ui/sider_panel/cell/ui_cell_mixin_draggable");
    var util = require("KCEPROD/util/util");

    var Mustache = require("mustache");
    var ns = window.kc.ns;

    return defineComponent(uiCellMixinDraggable, uiTabPanelLibrary);

    function uiTabPanelLibrary() {
        this.attributes({
            loadonce: false,
            picAddBtnSelector: "#library-add-pic",
            picUploadFileSelector: ".pic-upload-file",
            picBtnDivSelector: ".pic-btn-div",
            libraryTabSelector: "#tab-library",
            libraryPicBoxSelector: "#library-pic-box",
            pageid: 0,
            cellLibrarySelector: ".library-cell",
            cellImageSelector: ".cell-image",
            itemOpDeleteSelector: ".icon-shanchu",
            itemDraggable: ".item-draggable",
            picDialog: "",
            pic_dialog_url: "#pic_dialog_url",
            picPreview: "#picPreview",
            picAddClose: "#picAddClose",
            picSaveBtn: "#picSaveBtn"

        });

        this.renderTab = function(e, data) {
            if (!this.attr.loadonce) {
                console.log("render uiTabPanelLibrary is ok!");

                var that = this;
                $('body').append(this.getDialog());

                this.attr.picDialog = $("#uiPicAdd").dialog({
                    closeOnEscape:false,
                    create: function(event) {
                        $(event.target).dialog("widget").css({ "position": "fixed" });
                    },
                    resizable: false,
                    height: 400,
                    width: 680,
                    modal: true,
                    title: 'i am dialog',
                    position: { my: "top", at: "bottom", of: $('#artOpPanel') },
                    dialogClass: '',
                    autoOpen: false,
                    buttons: {

                    }
                });

                this.renderPicListScroll();
                this.addBoxListener();
            }
            this.attr.loadonce = true;
        }

        this.addBoxListener = function() {
            var that = this;

            $(this.attr.loveBoxSelector).scroll(function() {
                var $this = $(this);
                var height = this.scrollHeight - $this.height() - 50; // Get the height of the div
                var scroll = $this.scrollTop(); // Get the vertical scroll position

                var isScrolledToEnd = (scroll >= height);

                if (isScrolledToEnd) {
                    that.renderPicListScroll();
                }
            });

            this.on(this.attr.libraryTabSelector, 'click', {
                itemOpDeleteSelector: this.itemOpDelete,
                picAddBtnSelector: this.picAddDialog
            });

            this.on(this.attr.picBtnDivSelector, 'change', {
                picUploadFileSelector: this.picUpload
            });

            this.on(this.attr.picAddClose, 'click', this.closePicAddDialog);

            this.on(this.attr.pic_dialog_url, 'change', this.onImgUrlChange);
            this.on(this.attr.picSaveBtn, 'click', this.picSave);
        }

        this.renderPicListScroll = function() {
            this.trigger(ns.e.data.dataPicList, {
                pageid: this.attr.pageid,
                triggerEvent:ns.e.tab.uiPicList
            });
            this.attr.pageid++;
        }
        this.clearPicListInBox = function() {
            this.attr.pageid = 0;
            $(this.attr.libraryPicBoxSelector).html('');
        }

        this.itemOpDelete = function(e, data) {
            var lid = $(data.el).parent().data('id');
            this.trigger(ns.e.data.dataPicDelete, {
                lid: lid,
                el: data.el,
                triggerEvent:ns.e.tab.uiPicDelete
            });
        };
        this.picSave = function (){
            var url = $("#pic_dialog_url").val();
            this.picAdd(null, {
                url: url
            });

            this.closePicAddDialog();
        }

        this.picAdd = function(e, data) {
            this.trigger(ns.e.data.dataPicAdd, {
                url: data.url,
                triggerEvent:ns.e.tab.uiPicRefresh
            });
        }

        this.picUpload = function(e, data) {
            var file = $(data.el)[0].files[0];
            var that = this;
            var ic = ns.c.img;
            util.uploadfile(file, {
                success: function(blkRet) {
                    that.picAdd(null, {
                        url: ic.url + blkRet.key + "?" + ic.api_type + ic.suf + ic.mode + ic.suf + "w" + ic.suf + ic.pic_list_img.w
                    });
                },
                error: function() {

                }
            });
        }

        this.onImgUrlChange = function () {
            var url = $("#pic_dialog_url").val();
            $(this.attr.picPreview).attr("src",url);
        }

        this.picAddDialog = function() {
            util.displayGrayBg();
            this.attr.picDialog.dialog("open");
        }

        this.closePicAddDialog  = function() {
            this.attr.picDialog.dialog("close");
            util.hideGrayBg();
        }

        //callback when server send json data to client
        this.renderPicList = function(e, data) {
            $(this.attr.libraryPicBoxSelector).append(Mustache.render(this.getTmpl(), data.json));
            this.activeDraggable($(this.attr.itemDraggable));
        }

        this.renderPicDelete = function(e, data) {
            $(data.el).parent().parent().remove();
        }

        this.renderPicRefresh = function(e, data) {
            if (this.attr.loadonce) {
                /*var json = {
                    objs: {
                        id: data.json.lid,
                        url: data.url
                    }
                };
                $(this.attr.libraryPicBoxSelector).append(Mustache.render(this.getTmpl(), json));*/
                this.clearPicListInBox();
                this.renderPicListScroll();
            }
        }

        this.getDialog = function() {
            return [
                // '<div id="uiPicAdd">',
                // '<div>',
                // '<label style="display:inline-block;">图片链接地址:</label>',
                // '<input type="text" id="pic_dialog_url" style="display:inline-block;width:300px;"/>',
                // '</div>',
                // '</div>',
                '<div id="uiPicAdd" class="popContent9 displayT">\
                    <img id="picAddClose" src="images/p3_7.png" class="popClose" />\
                    <div class="pd20 displayTC">\
                        <div class="font16 colorBlack">图片</div>\
                        <div class="bgWhite1 pt20 pb20">\
                            <input id="pic_dialog_url" class="input1 width6 bgGray1 pd10 borderR5" type="text" placeholder="输入链接">\
                        </div>\
                        <div class="textC pt10">\
                            <a id="picSaveBtn" class="displayI bgYellow font16 colorWhite pt5 pb5 pl30 pr30">保存</a>\
                        </div>\
                    </div>\
                    <div class="bgGray3 pd20 displayTC borderTR5 borderBR5">\
                        <div class="displayI font14 colorGray border1 pt5 pb5 pl10 pr10">预览</div>\
                        <img id="picPreview" src="" class="displayB width6 mt20" />\
                    </div>\
                </div>'
            ].join('\n');
        }

        this.getTmpl = function() {
            return [
                '{{#objs}}',
                '<div class="cell-image item-draggable" style="position:relative" targettype="image" src="{{url}}">',
                '<div class="item-op-center" data-id="{{id}}">',
                '<i class="iconfont icon-shanchu"/>',
                '</div>',
                '<div class="library-cell">',
                '<img src="{{url}}"/>',
                '</div>',
                '</div>',
                '{{/objs}}',
            ].join('\n');
        }

        this.doDirectInsert = function (e, data){
            var lastIdx = util.getLastCanvasItemIndex();

            var styleObj = {};
            styleObj['src']= e.currentTarget.attributes['src'].value;
            this.trigger(ns.e.createNode, {
                itemtype: 'image',
                para :  styleObj,
                el:$(".canvas > [kctype='container']")[0],
                preel: lastIdx,
            });
        }

        this.after("initialize", function() {
            console.log("uiTabPanelLibrary is ok!");
            this.on(document, ns.e.tab.uiTabLibrary, this.renderTab);
            this.on(document, ns.e.tab.uiPicList, this.renderPicList);
            this.on(document, ns.e.tab.uiPicDelete, this.renderPicDelete);
            this.on(document, ns.e.tab.uiPicRefresh, this.renderPicRefresh);
            this.on('click', {cellImageSelector: this.doDirectInsert});
        });
    }
});
