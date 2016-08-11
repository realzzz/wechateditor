/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 10:47:22
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-18 19:19:23
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    var align_value_map = {
        "imgAlignLeft":"",
        "imgAlignCenter":"center"

    };

    return uiMixinImageAlign;

    function uiMixinImageAlign() {
        this.attributes({
            imgAlignBox:"#imgAlignBox",
            imgAlignDom: "",
            imgAlignLeft:"#imgAlignLeft",
            imgAlignCenter:"#imgAlignCenter",
            imgAlignRight:"#imgAlignRight",
        });

        this.renderImageAlign= function() {
            this.attr.imgAlignDom = $(this.getImageAlignHtml());
            this.attachEventToImageAlign();
            this.attr.imgAlignDom.appendTo(this.attr.propertyPanelDom);
            this.initImageAlignAttach();
        };

        this.applyAlign = function(e, data) {
            if (e.currentTarget.id === 'imgAlignLeft' || e.currentTarget.id === 'imgAlignCenter' )
            {
                this.trigger(ns.e.updateNode, {
                    para: {
                        "align" : align_value_map[e.currentTarget.id],
                        style:{"float" : ""}
                    },
                    kcpath: this.attr.targetKcPath
                });
            }
            else if(e.currentTarget.id === 'imgAlignRight'){
                this.trigger(ns.e.updateNode, {
                    para: {
                        style:{"float" : "right"}
                    },
                    kcpath: this.attr.targetKcPath
                });
            }
        }

        this.attachEventToImageAlign = function() {
            var me = this;

        };

        this.prepareImageAlign=function(){
            // consider this TODO
            //this.on(this.attr.boldS, "click", this.applyStyle);

        };

        this.getImageAlignHtml = function() {
            return [
                '<div id="imgAlignBox" class="pb10 pt10 borderB1 textC">',
                '<div class="font14 colorWhite pl15 pt10 textL">对齐</div> ',
                '<a id="imgAlignLeft" class="displayI pt5 pr15" title="左对齐"><img src="images/p1_23_2.png"></a>',
                '<a id="imgAlignCenter" class="displayI pt5 pr15" title="居中对齐"><img src="images/p1_23_3.png"></a>',
                '<a id="imgAlignRight" class="displayI pt5 pr15" title="右对齐"><img src="images/p1_23_4.png"></a>',
                '</div>'
            ].join('\n');
        };

        this.initImageAlignAttach =  function() {
            this.on(document, "click", {
                imgAlignLeft: this.applyAlign,
                imgAlignCenter: this.applyAlign,
                imgAlignRight: this.applyAlign,
            });
        };
    };
});
