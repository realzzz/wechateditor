/*
 * @Author: Vaninadh
 * @Date:   2016-04-25 18:43:08
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-17 15:10:19
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var Mustache = require("mustache");

    var ns = window.kc.ns;
    return defineComponent(uiImageSelectUrl);

    function uiImageSelectUrl() {
        this.attributes({
            imageSelectDialogUrlIdSelector: "#image-select-dialog-url",
            oriImageSrc: "",
            inputDom: "",
            imgDom: "",
            imagePicUseSelector: "#pic-use"
        });

        this.renderTab = function(e, data) {
            this.attr.targetEl = data.targetEl;
            this.attr.targetKcPath = data.targetKcPath;
            this.attr.oriImageSrc = data.oriImageSrc;

            if (!this.attr.loadonce) {
                var dom = $(this.getHtml());
                this.attr.inputDom = dom.find("input");
                this.attr.imgDom = dom.find("img");
                var me = this;
                this.attr.inputDom.blur(function() {
                    me.attr.imgDom.attr("src", $(this).val());
                });

                dom.appendTo(this.attr.imageSelectDialogUrlIdSelector);

                this.on(this.attr.imageSelectDialogUrlIdSelector, 'click', {
                    imagePicUseSelector: this.picUse
                });

                this.attr.loadonce = true;
            }

            this.attr.inputDom.val(this.attr.oriImageSrc);
            this.attr.imgDom.attr("src", this.attr.oriImageSrc);
        }

        this.picUse = function() {
            var src = this.attr.imgDom.attr("src");
            var targetKcPath = this.attr.targetKcPath;
            this.trigger(ns.e.updateNode, {
                para: {
                    'src': src
                },
                kcpath: targetKcPath
            });
            this.trigger(ns.e.canvas.uiImageSelectClose);
        }

        this.getHtml = function() {
            return [
                '<div class="bgWhite1 pt20 pb20">',
                '<div>',
                '<input type="text" placeholder="在这里粘贴图片链接"/>',
                '</div>',
                '<div class="image-select-dialog-img">',
                '<img width="280" src=""/>',
                '</div>',
                '</div>',
                '<div class="textC pt10">',
                '<a id="pic-use">使用</a>',
                '</div>',
            ].join('\n');
        }
        this.after('initialize', function() {
            console.log("uiImageSelectUrl is ok!");
            this.on(document, ns.e.canvas.imgSelect.uiTabImageSelectUrl, this.renderTab);
        });
    }
})
