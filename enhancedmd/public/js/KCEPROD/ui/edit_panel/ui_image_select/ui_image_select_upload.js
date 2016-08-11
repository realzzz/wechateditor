/*
 * @Author: Vaninadh
 * @Date:   2016-04-25 18:43:23
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-17 15:10:23
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var Mustache = require("mustache");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    return defineComponent(uiImageSelectUpload);

    function uiImageSelectUpload() {
        this.attributes({
            loadonce: false,
            imageSelectIdSelector: '#uiImageSelect',
            imageListBoxSelector: "#image-select-box",
            picBtnDialogSelector: ".pic-btn-dialog-div",
            picUploadFileDialogSelector: ".pic-upload-file-dialog",
            pageid: 0,
            imageReviewSelector: "#img-review",
            imagePicUseSelector: "#pic-use",
            targetEl: '',
            targetKcPath: '',
            imageSelectDialogUploadIdSelector: "#image-select-dialog-upload",
            inputDom:"",
            imgDom:""
        });

        this.renderTab = function(e, data) {
            this.attr.targetEl = data.targetEl;
            this.attr.targetKcPath = data.targetKcPath;
            this.attr.oriImageSrc = data.oriImageSrc;

            if (!this.attr.loadonce) {
            	var dom = $(this.getHtml());
                this.attr.inputDom = dom.find(this.attr.picUploadFileDialogSelector);
                this.attr.imgDom = dom.find("img");
                var me = this;
                dom.appendTo(this.attr.imageSelectDialogUploadIdSelector);

                this.on(this.attr.imageSelectDialogUploadIdSelector, 'change', {
                    picUploadFileDialogSelector: this.picUpload
                });

                this.on(this.attr.imageSelectDialogUploadIdSelector, 'click', {
                    imagePicUseSelector: this.picUse
                });

                this.attr.loadonce = true;
            }

        }

        this.picUse = function(e, data) {
            var src = $(this.attr.imageReviewSelector).find('img').attr('src');
            var targetKcPath = this.attr.targetKcPath;
            this.trigger(ns.e.updateNode, {
                para: {
                    'src': src
                },
                kcpath: targetKcPath
            });
			this.trigger(ns.e.canvas.uiImageSelectClose);
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

        this.picAdd = function(e, data) {
            this.trigger(ns.e.data.dataPicAdd, {
                url: data.url,
                triggerEvent: ns.e.canvas.imgSelect.uiCanvasPicRefresh
            });
        }

        this.canvasPicRefresh = function(e, data) {
            $(this.attr.imageReviewSelector).find('img').attr('src', data.url);
        }

        this.getHtml = function() {
            return [
                '<div class="bgWhite1 pt20 pb20">',
                '<div class="pic-btn-dialog-div">',
                '<a class="displayI bgYellow font16 colorWhite pt5 pb5 pl30 pr30">上传图片</a>',
                '<input class="pic-upload-file-dialog" type="file"/>',
                '</div>',
                '<div id="img-review" class="image-select-dialog-img">',
                '<img width="280" src=""/>',
                '</div>',
                '</div>',
                '<div class="textC pt10">',
                '<a id="pic-use">使用</a>',
                '</div>'
            ].join('\n');
        }

        this.after('initialize', function() {
            console.log("uiImageSelectUpload is ok!");
            this.on(document, ns.e.canvas.imgSelect.uiCanvasPicRefresh, this.canvasPicRefresh);
            this.on(document, ns.e.canvas.imgSelect.uiTabImageSelectUpload, this.renderTab);
        });
    }
})
