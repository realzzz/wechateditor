/*
    <div class="popContent5 textC ">
        <div class="phonePreview displayI">
            <div class="ppTitle">硅谷密探</div>
            <div id="preContent" class="ppContent displayI" ></div>
        </div>

        <div class="displayI verTop pl15 mt80">
            <img src="images/p2_2.jpg" width="100" />
            <div class="font14 colorWhite pt10">扫描二维码进行手机预览</div>
        </div>
    </div>
*/



define(function(require) {
    var defineComponent = require("flight/lib/component");

    var Mustache = require("mustache");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    var prehtml = '\
        <h3 class="rich_media_title" id="activity-name">\
            {{title}}\
        </h3>\
        <div class="rich_media_meta_list">\
            <em id="post-date" class="rich_media_meta rich_media_meta_text">{{date}}</em>\
            <span style = "font-size:16px; color:#607fa6;">公众号名称</span>\
        </div> <br>\
    ';

    return defineComponent(uiPreviewPopUp);

    function uiPreviewPopUp() {

        this.attributes({
            previewPanel: '#previewPanel',
            preContent: '#preContent',
            previewDialog: ''
        });

        this.showPreviewDialog = function () {
            util.clearCanvasHelpers();
            var titletext = $('#a-title-input')[0].value;
            var datetext = util.getDateIdx();

            var headerHtml = Mustache.render(prehtml, {title:titletext, date:datetext})

            var previewHtml = $('.canvas').html();
            $(this.attr.preContent).html(headerHtml + previewHtml);
            util.displayGrayBg();
            this.attr.previewDialog.dialog("open");
        }

        this.hidePreviewDialog = function () {
            this.attr.previewDialog.dialog("close");
            $(this.attr.preContent).html("");
            util.hideGrayBg();
        }

        this.getDialog = function() {
            return [
                '<div id="previewPanel">',
                '<div class="phonePreview displayI">\
			        <div class="ppTitle"></div>\
		        	<div id="preContent" class="ppContent displayI" ></div>\
		        </div>',
                '</div>'
            ].join('\n');
        }

        this.after('initialize', function() {
        	console.log("uiHeader is ok!");

            $('body').append(this.getDialog());

            var thisRef = this;

            this.attr.previewDialog = $("#previewPanel").dialog({
                closeOnEscape:false,
                resizable: false,
                height:600,
                width: 360,
                //height: '100%',
                //width: '100%',
                show: "fade",
                hide: "fade",
                modal: true,
                title: '',
                position: { my: "top", at: "top", of: window },
                dialogClass: '',
                autoOpen: false,
                close: function( event, ui ) {
                    thisRef.hidePreviewDialog();
                },
                buttons: [{
                    id: "previewCloseBtn",
                    text: "关闭",
                    click: function () {
                        $(this).dialog('close');
                    }
                }]
            });

            this.on(document, ns.e.article.uiAritclePrivew, this.showPreviewDialog);

        });
    }
})
