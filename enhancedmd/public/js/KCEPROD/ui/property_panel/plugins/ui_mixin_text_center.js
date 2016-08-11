/*
* @Author: Vaninadh
* @Date:   2016-04-19 15:49:11
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-04-19 16:09:37
*/

define(function(require) {
	var compose = require("flight/lib/compose");
    var uiMixinTextColor = require("KCEPROD/ui/property_panel/plugins/text/ui_mixin_text_color");
    var uiMixinTextShadow = require("KCEPROD/ui/property_panel/plugins/text/ui_mixin_text_shadow");
	var uiMixinTextFamily = require("KCEPROD/ui/property_panel/plugins/text/ui_mixin_text_family");
    var uiMixinTextStyle = require("KCEPROD/ui/property_panel/plugins/text/ui_mixin_text_style");
    var uiMixinTextAlign = require("KCEPROD/ui/property_panel/plugins/text/ui_mixin_text_align");

    var ns = window.kc.ns;
    return uiMixinTextCenter;

    function uiMixinTextCenter() {
    	//if it has other plugin
    	//use like : compose.mixin(this, [uiMixinTextFamily,xxxxx]);
    	compose.mixin(this, [uiMixinTextFamily,uiMixinTextColor,uiMixinTextShadow, uiMixinTextStyle,uiMixinTextAlign]);

        this.attributes({
            textCenterDom: "",
            textCenterSelector:""
        });

        this.renderTextCenter = function() {
            this.attr.textCenterDom = $(this.getTextCenterHtml());
            this.renderTextCenterChildren();
            this.attr.textCenterDom.appendTo(this.attr.propertyPanelDom);
        };
        this.renderTextCenterChildren=function(){
        	this.renderTextFamily();
            this.renderTextColor();
            //this.renderTextShadow();
            this.renderTextStyle();
            this.renderTextAlign();
        };

        this.prepareTextCenter = function() {
        	this.prepareTextFamily();
            this.prepareTextColor();
            //this.prepareTextShadow();
            this.prepareTextStyle();
            this.prepareTextAlign();
        };

        this.getTextCenterHtml = function() {
            return [
                
            ].join('\n');
        }
    };
});
