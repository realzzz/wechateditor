/*
 * @Author: Vaninadh
 * @Date:   2016-04-16 13:57:39
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-27 19:17:50
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var Mustache = require("mustache");
    var imagesloaded = require('imagesloaded');
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    var tabs_event_map = {
        'tab-isd-url': ns.e.canvas.imgSelect.uiTabImageSelectUrl,
        'tab-isd-upload': ns.e.canvas.imgSelect.uiTabImageSelectUpload,
        'tab-isd-library': ns.e.canvas.imgSelect.uiTabImageSelectLibrary
    };

    return defineComponent(uiArticlePanel);

    function uiArticlePanel() {
        this.attributes({
            loadonce: false,
            targetClass: '.canvas',
            articleListSelector: ".article-list",
            mainEditorSelector: ".main-editor",
            articleListBoxSelector: ".article-box ul",
            editIconSelector: '.icon-bianji',
            deleteIconSelector: '.icon-shanchu',
            articleOpSelector: '.article-op',
            articleHeaderSelector: '.article-header',
            articleCreateSelector: '#article-create',
            pruneArtBtnSelector: '#pruneArtBtn',
            pageid: 0
        });

        this.activateArticleList = function(e, data) {
            if ($(this.attr.articleListSelector).is(':hidden')) {
                if (!this.attr.loadonce) {
                    $(this.attr.articleListBoxSelector).masonry({
                        itemSelector: 'li',
                        animate: true,
                        columnWidth: 245
                    });
                    this.on(this.attr.articleListSelector, 'click', {
                        editIconSelector: this.itemOpEdit,
                        deleteIconSelector: this.itemOpDelete,
                        articleCreateSelector: this.articleCreate
                    });
                    this.on(this.attr.pruneArtBtnSelector, 'click', this.pruneArticle);
                    this.attr.loadonce = true;
                }else{
                    this.clearBox();
                     $('body,html').animate({
                    scrollTop: 0
                }, 200);
                }
                this.renderArticleListScroll();
                this.addBoxListener();
                $(this.attr.mainEditorSelector).hide();
                $(this.attr.articleListSelector).show();
            } else {
                $(this.attr.mainEditorSelector).show();
                $(this.attr.articleListSelector).hide();
                this.clearEvent();
                //动态置顶
                $('body,html').animate({
                    scrollTop: 0
                }, 200);
            }

            this.trigger(window.kc.ns.e.canvas_clear_selection);
        }

        this.addBoxListener = function() {
            var that = this;
            //scroll by window bar
            $(window).scroll(function() {
                var $this = $(this);
                var height = $(document).height() - 20; // Get the height of the div
                var scroll = $this.scrollTop() + $this.height(); // Get the vertical scroll position

                var isScrolledToEnd = (scroll >= height);
                if (isScrolledToEnd) {
                    that.renderArticleListScroll();
                }
            });

        };

        this.clearBox = function() {
            this.attr.pageid = 0;
            $(this.attr.articleListBoxSelector).empty()
                .masonry('destroy').masonry({
                    itemSelector: 'li',
                    animate: true,
                    columnWidth: 245
                });
        }

        //clear event :cause when article list is hided, the scroll is also used
        this.clearEvent = function() {
            //this.off(this.attr.articleListSelector, 'click');
            $(window).off('scroll');
        }

        this.articleCreate = function() {
            var eventDataObj = {
                el: this.attr.targetClass,
                para: {},
                respEvent: ns.e.article.uiArticleEdit
            }
            this.trigger(ns.e.createArticle, eventDataObj);
        }

        this.pruneArticle = function(e, data) {
            var eventDataObj = {
                el: this.attr.targetClass,
                para: {},
                respEvent: ns.e.article.uiArticlePrune
            }
            this.trigger(ns.e.pruneArticle, eventDataObj);
        }

        this.itemOpEdit = function(e, data) {
            var id = $(data.el).closest(this.attr.articleOpSelector).data('id');

            var eventDataObj = {
                aid: id,
                el: this.attr.targetClass,
                para: {},
                respEvent: ns.e.article.uiArticleEdit
            }
            this.trigger(ns.e.renderArticle, eventDataObj);
        }

        this.itemOpDelete = function(e, data) {
            var id = $(data.el).closest(this.attr.articleOpSelector).data('id');
            this.trigger(ns.e.data.dataArticleDelete, {
                articleid: id
            });
        }

        this.renderArticleListScroll = function() {
            this.trigger(ns.e.data.dataArticleList, {
                pageid: this.attr.pageid
            });
            this.attr.pageid++;
        }

        this.getTmpl = function() {
            return [
                '{{#objs}}',
                '<li>',
                '<div class="article-container">',
                '<div style="height: 100%;">',
                '<div class="article-title">',
                '<h5>',
                '{{titles}}',
                '</h5>',
                '<div class="article-describe">',
                '<span>',
                '{{description}}',
                '</span>',
                '</div>',
                '</div>',
                '<div class="aricle-img">',
                '<img src="images/p1_16.jpg" style="height:0px" alt=""/>',
                '</div>',
                '<span class="article-time">',
                '{{updatedTime}}',
                '</span>',
                '</div>',
                '<div class="article-op" data-id="{{id}}">',
                '<span><i class="iconfont icon-bianji"></i></span>',
                '<span class="last"><i class="iconfont icon-shanchu"></i></span>',
                '</div>',
                '</div>',
                '</li>',
                '{{/objs}}'
            ].join("\n");
        }

        this.renderArticleList = function(e, data) {
            var me = this;
            /*
            var dataObj = {objs: data.json.objs,
                           updatedTime: function(){
                               var ndate = new Date(this.updated);
                               var month = ndate.getMonth() + 1;
                               return month + "-" + ndate.getDate() + " " + ndate.getHours() + ":" + ndate.getMinutes();
                           }};

            $(Mustache.render(this.getTmpl(), dataObj)).imagesLoaded().progress(function(instance, image) {
                var liDom = $(image.img).closest('li');
                $(me.attr.articleListBoxSelector).append(liDom).masonry('appended', liDom);
            });
            */
            var objects = data.json.objs;
            for (var i = 0; i < objects.length; i++) {
                var dataObj = {objs: [objects[i]],
                               updatedTime: function(){
                                   var ndate = new Date(this.updated);
                                   var month = ndate.getMonth() + 1;
                                   return month + "-" + ndate.getDate() + " " + ndate.getHours() + ":" + ndate.getMinutes();
                               },
                                titles: function(){
                                    var title = this.title;
                                    if (util.isEmptyStr(title)) {
                                        return "无标题";
                                    }
                                    else{
                                        return title;
                                    }
                                }};
                var itemhtml = $(Mustache.render(this.getTmpl(), dataObj)).imagesLoaded().progress(function(instance, image) {
                    var liDom = $(image.img).closest('li');
                    //$(me.attr.articleListBoxSelector).append(liDom).masonry('appended', liDom);
                });

                $(me.attr.articleListBoxSelector).append(itemhtml).masonry('appended', itemhtml)
            }

        }

        this.renderArticleDelete = function(e, data) {
            this.clearBox();
            this.renderArticleListScroll();
        }

        this.renderArticleEdit = function(e, data) {
            $(this.attr.mainEditorSelector).show();
            $(this.attr.articleListSelector).hide();
            this.clearEvent();
            //动态置顶
            $('body,html').animate({
                scrollTop: 0
            }, 200);
        }
        this.after('initialize', function() {
            console.log("uiArticlePanel is ok!");
            this.on(document, ns.e.article.uiArticleListActivate, this.activateArticleList);
            this.on(document, ns.e.article.uiArticleList, this.renderArticleList);
            this.on(document, ns.e.article.uiArticleDelete, this.renderArticleDelete);
            this.on(document, ns.e.article.uiArticleEdit, this.renderArticleEdit);
            this.on(document, ns.e.articlelistCreateNewArtile, this.articleCreate)


        });
    }
})
