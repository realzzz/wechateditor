/*
 * @Author: Vaninadh
 * @Date:   2016-03-30 19:40:28
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-14 19:35:07
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var Mustache = require("mustache");
    var ns = window.kc.ns;

    var uiCellTemplate = require('KCEPROD/ui/sider_panel/cell/ui_cell_template');

    return defineComponent(uiTabPanelTemp);

    function uiTabPanelTemp() {
        this.attributes({
            loadonce: false,
            tempSelector: "#temp-menu",
            pageid: 0,
            tempboxSelector: "#tempbox",
            tempCellSelector: ".temp-cell",
            tempOpSelector: ".temp-op",
            //tempOpSpanListener: "span",
            type: "",
            subtype: ""
        });

        this.renderTab = function(e, data) {
            //only load one times
            if (!this.attr.loadonce) {
                $(this.attr.tempSelector).menu({
                    position: {
                        my: 'left top',
                        at: 'left bottom',
                        collision: "none"
                    },
                    select: this.selectShow.bind(this)
                });

                this.addBoxListener();
                //init all type data render to tempbox
                $(this.attr.tempSelector).find("li").first().click();
            }

            this.attr.loadonce = true;
        }

        this.selectShow = function(e, ui) {
            this.tempBoxClear();
            //get different type data list render to tab panel
            this.attr.type = $(ui.item).data('type');
            this.attr.subtype = $(ui.item).data('subtype');
            //if menu is submenu ,and get the parent`s type from ul tag
            if (this.attr.type == undefined) {
                this.attr.type = $(ui.item).parent('ul').first().data('type');
                if (this.attr.type == undefined) {
                    this.attr.type = "";
                }
            };

            if (this.attr.subtype == undefined) {
                this.attr.subtype = "";
            };

            this.renderTemplateListScroll();
        }

        this.addBoxListener = function() {
            var that = this;

            //add scroll event ,when scroll to the end of div ,then request servers
            $(this.attr.tempboxSelector).scroll(function() {
                var $this = $(this);
                var height = this.scrollHeight - $this.height() - 50; // Get the height of the div
                var scroll = $this.scrollTop(); // Get the vertical scroll position

                var isScrolledToEnd = (scroll >= height);

                if (isScrolledToEnd) {
                    that.renderTemplateListScroll();
                }
            });

            this.on(this.attr.tempboxSelector, "click", {
                tempOpSelector: this.collect
            })
        }

        this.collect = function(e, data) {
            var id = $(data.el).data("id");
            this.trigger(ns.e.data.dataTemplateCollect, {
                id: id,
                orihtml: "",
                el:data.el
            });
        }

        this.renderCollectEffect = function(e, data) {
            var iObj=$(data.el).find('i');
            if(iObj.hasClass('icon-shoucang')){
                iObj.removeClass('icon-shoucang').addClass('icon-shoucangp');
            }else{
                iObj.removeClass('icon-shoucangp').addClass('icon-shoucang');
            }
            //add refreash collecttemp list in collect
            this.trigger(ns.e.tab.uiTemplateCollectRefresh);
        }

        this.tempBoxClear = function() {
            $(this.attr.tempboxSelector).html('');
            this.attr.pageid = 0;
        }

        //callback when server send json data to client
        this.renderTemplateList = function(e, data) {
            $(this.attr.tempboxSelector).append(Mustache.render(this.getTmpl(), data.json));
            uiCellTemplate.attachTo('.temp-cell');
        }

        this.getTmpl = function() {
            return [
                '{{#objs}}',
                '<div class="temp-cell cell-list" data-id="{{id}}" style="width:280px" targettype="template">',
                '{{{ori_html}}}',
                '</div>',
                '<div class="temp-op" data-id="{{id}}">',
                '<span><i class="iconfont icon-shoucang"></i></span>',
                '</div>',
                '{{/objs}}'
            ].join('\n');
        }

        //render the tabbox when scroll to buttom
        this.renderTemplateListScroll = function() {
            this.trigger(ns.e.data.dataTemplateList, {
                type: this.attr.type,
                subtype: this.attr.subtype,
                pageid: this.attr.pageid
            });
            this.attr.pageid++;
        }

        this.after("initialize", function() {
            console.log("uiTabPanelTemp is ok!");

            this.on(document, ns.e.tab.uiTabTemp, this.renderTab);
            this.on(document, ns.e.tab.uiTemplateList, this.renderTemplateList);
            this.on(document, ns.e.tab.uiTemplateCollectEffect, this.renderCollectEffect);
        });
    }
});
