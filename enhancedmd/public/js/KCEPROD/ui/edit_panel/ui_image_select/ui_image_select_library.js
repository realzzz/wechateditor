/*
 * @Author: Vaninadh
 * @Date:   2016-04-25 18:44:43
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-17 15:10:26
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;
    var Mustache = require("mustache");
    var imagesloaded = require('imagesloaded');
    return defineComponent(uiImageSelectLibrary);

    function uiImageSelectLibrary() {
        this.attributes({
            loadonce: false,
            pageid: 0,
            imageSelectDialogLibrarySelector: "#image-select-dialog-library",
            imageSelectDialogLibraryBoxSelector: '#image-select-dialog-library ul',
            imageSelectDialogLibraryBoxDivSelector: '.image-select-dialog-library-box',
            imageSrc: '',
            liTag: 'li',
            imagePicUseSelector: "#pic-use"
        });

        this.renderTab = function(e, data) {
            this.attr.targetEl = data.targetEl;
            this.attr.targetKcPath = data.targetKcPath;
            this.attr.oriImageSrc = data.oriImageSrc;

            if (!this.attr.loadonce) {
                var dom = $(this.getHtml());

                dom.appendTo(this.attr.imageSelectDialogLibrarySelector);

                $(this.attr.imageSelectDialogLibraryBoxSelector).masonry({
                    itemSelector: 'li',
                    animate: true,
                    columnWidth: 70
                });

                this.addBoxListener();

                this.attr.loadonce = true;
            } else {
                this.clearBox();
            }
            this.renderPicListScroll();
        }

        this.addBoxListener = function() {
            var me = this;

            $(this.attr.imageSelectDialogLibraryBoxDivSelector).scroll(function() {
                var $this = $(this);
                var height = this.scrollHeight - $this.height() - 50; // Get the height of the div
                var scroll = $this.scrollTop(); // Get the vertical scroll position

                var isScrolledToEnd = (scroll >= height);

                if (isScrolledToEnd) {
                    me.renderPicListScroll();
                }
            });

            this.on(this.attr.imageSelectDialogLibraryBoxSelector, 'click', {
                liTag: this.picSelect
            });

            this.on(this.attr.imageSelectDialogLibrarySelector, 'click', {
                imagePicUseSelector: this.picUse
            });
        };

        this.picSelect = function(e, data) {
            var dom=$(data.el);
            this.attr.imageSrc = dom.find('img').attr('src');
            dom.siblings('li').removeClass('selected');
            dom.addClass('selected');
        };

        this.clearBox = function() {
            this.attr.pageid = 0;
            $(this.attr.imageSelectDialogLibraryBoxSelector).empty()
                .masonry('destroy').masonry({
                    itemSelector: 'li',
                    animate: true,
                    columnWidth: 70
                });
        }

        this.picUse=function(){
            var src=this.attr.imageSrc;
            var targetKcPath = this.attr.targetKcPath;
            this.trigger(ns.e.updateNode, {
                para: {
                    'src': src
                },
                kcpath: targetKcPath
            });
            this.trigger(ns.e.canvas.uiImageSelectClose);
        }

        this.renderPicListScroll = function() {
            this.trigger(ns.e.data.dataPicList, {
                pageid: this.attr.pageid,
                triggerEvent: ns.e.canvas.imgSelect.uiImageSelectPicList
            });
            this.attr.pageid++;
        }

        this.renderPicList = function(e, data) {
            var me = this;
            $(Mustache.render(this.getTmpl(), data.json)).imagesLoaded().progress(function(instance, image) {
                var liDom = $(image.img).closest('li');
                $(me.attr.imageSelectDialogLibraryBoxSelector).append(liDom).masonry('appended', liDom);
            });
        }

        this.getHtml = function() {
            return [
                '<div class="bgWhite1 pt20 pb20" >',
                '<div class="image-select-dialog-library-box">',
                '<ul>',
                '</ul>',
                '</div>',
                '<div class="textC pt10">',
                '<a id="pic-use">使用</a>',
                '</div>',
                '</div>'
            ].join('\n');
        }

        this.getTmpl = function() {
            return [
                '{{#objs}}',
                '<li>',
                '<img width="190" src="{{url}}"/>',
                '</li>',
                '{{/objs}}'
            ].join('\n');
        }

        this.after('initialize', function() {
            console.log("uiImageSelectLibrary is ok!");
            this.on(document, ns.e.canvas.imgSelect.uiTabImageSelectLibrary, this.renderTab);
            this.on(document, ns.e.canvas.imgSelect.uiImageSelectPicList, this.renderPicList);
        });
    }
})
