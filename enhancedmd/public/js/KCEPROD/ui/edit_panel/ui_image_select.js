/*
 * @Author: Vaninadh
 * @Date:   2016-04-21 18:23:47
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-17 15:59:41
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiImageSelectUrl = require("KCEPROD/ui/edit_panel/ui_image_select/ui_image_select_url");
    var uiImageSelectUpload = require("KCEPROD/ui/edit_panel/ui_image_select/ui_image_select_upload");
    var uiImageSelectLibrary = require("KCEPROD/ui/edit_panel/ui_image_select/ui_image_select_library");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    var tabs_event_map = {
        'image-select-dialog-url': ns.e.canvas.imgSelect.uiTabImageSelectUrl,
        'image-select-dialog-upload': ns.e.canvas.imgSelect.uiTabImageSelectUpload,
        'image-select-dialog-library': ns.e.canvas.imgSelect.uiTabImageSelectLibrary
    };

    return defineComponent(uiImageSelect);

    function uiImageSelect() {
        this.attributes({
            loadonce: false,
            canvasSelector: '.canvas',
            imageSelectDialog: '',
            imageSelectIdSelector: '#uiImageSelect',
            imageSelectTabSelector: '#uiImageSelect ul',
            imageTargetSelector: "[kctype=image]",
            targetEl: '',
            targetKcPath: '',
            imageSelectPopupCloseSelector: "#imageSelectPopupClose",
            imageSelectDialogTab: ".image-select-dialog-tab",
            oriImageSrc: ""
        });

        this.eventListenerInit = function() {
            var me = this;
            $(this.attr.canvasSelector).on("dblclick", this.attr.imageTargetSelector, function(e, data) {
                var el = this;
                me.trigger(ns.e.canvas.uiImageSelectActivate, {
                    el: el
                })
            });
        }

        this.activateImageSelect = function(e, data) {
            this.attr.targetEl = $(data.el);
            var newtargetKcPath = util.kcpathToSelector(util.constructKcPath(this.attr.targetEl.context), window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
            this.attr.oriImageSrc = this.attr.targetEl.find('img').attr("src");
            if (!this.attr.loadonce) {

                uiImageSelectUrl.attachTo(document);
                uiImageSelectUpload.attachTo(document);
                uiImageSelectLibrary.attachTo(document);

                this.attr.targetKcPath = newtargetKcPath;

                var that = this;
                $('body').append(this.getDialog());

                this.attr.imageSelectDialog = $(this.attr.imageSelectIdSelector).dialog({
                    closeOnEscape: false,
                    create: function(event) {
                        $(event.target).dialog("widget").css({ "position": "fixed" });
                    },
                    resizable: false,
                    height: 400,
                    width: 600,
                    modal: true,
                    show: "fade",
                    hide: "fade",
                    position: { my: "top", at: "top", of: window },
                    dialogClass: '',
                    autoOpen: false
                });

                $(this.attr.imageSelectDialogTab).tabs({
                    create: this.tabsCreate.bind(this),
                    activate: this.tabsActivate.bind(this)
                });

                this.on(this.attr.imageSelectIdSelector, 'click', {
                    imageSelectPopupCloseSelector: this.closeDialog
                });

                this.attr.loadonce = true;
            } else {
                //when targetKcPath is not equal with the new one,then reload event
                if (this.attr.targetKcPath != newtargetKcPath) {
                    
                    this.attr.targetKcPath = newtargetKcPath;

                    var href = $(this.attr.imageSelectIdSelector).find('.ui-tabs-active a').attr('href');
                    var id = href.substring(1, href.length);
                    this.trigger(tabs_event_map[id], {
                        targetEl: this.attr.targetEl,
                        targetKcPath: this.attr.targetKcPath,
                        oriImageSrc: this.attr.oriImageSrc
                    });
                }
            }



            this.dialogOpen();
        }

        //first create
        this.tabsCreate = function(event, ui) {
            this.trigger(ns.e.canvas.imgSelect.uiTabImageSelectUrl, {
                targetEl: this.attr.targetEl,
                targetKcPath: this.attr.targetKcPath,
                oriImageSrc: this.attr.oriImageSrc
            });
        }

        this.tabsActivate = function(event, ui) {
            var id = $(ui.newPanel).attr('id');
            if (id != undefined) {
                this.trigger(tabs_event_map[id], {
                    targetEl: this.attr.targetEl,
                    targetKcPath: this.attr.targetKcPath,
                    oriImageSrc: this.attr.oriImageSrc
                });
            };
        }

        this.dialogOpen = function(e, data) {
            this.attr.imageSelectDialog.dialog("open");
            util.displayGrayBg();
        }

        this.closeDialog = function() {
            this.attr.imageSelectDialog.dialog("close");
            util.hideGrayBg();
        }

        this.getDialog = function() {
            return [
                '<div id="uiImageSelect" class="popContent10 displayT">',
                '<img id="imageSelectPopupClose" src="images/p3_7.png" class="popClose" />',
                '<div class="pd20 displayTC">',
                '<div class="font16 colorBlack image-select-dialog-name">图片管理</div>',
                '<div class="image-select-dialog-tab">',
                '<div class="image-select-dialog-title">',
                '<ul>',
                '<li><a href="#image-select-dialog-url">图片链接</a></li>',
                '<li><a href="#image-select-dialog-upload">本地上传</a></li>',
                '<li><a href="#image-select-dialog-library">图片库</a></li>',
                '</ul>',
                '</div>',

                '<div id="image-select-dialog-url" class="image-select-dialog-box">',

                '</div>',

                '<div id="image-select-dialog-upload" class="image-select-dialog-box" style="display: none;">',

                '</div>',

                '<div id="image-select-dialog-library" class="image-select-dialog-box" style="display: none;">',

                '</div>',

                '</div>',
                '</div>'
            ].join('\n');
        };

        this.after('initialize', function() {
            console.log("uiImageSelect is ok!");
            this.on(document, ns.e.canvas.uiImageSelectInit, this.eventListenerInit);
            this.on(document, ns.e.canvas.uiImageSelectActivate, this.activateImageSelect);
            this.on(document, ns.e.canvas.uiImageSelectClose, this.closeDialog);
        });
    }
})
