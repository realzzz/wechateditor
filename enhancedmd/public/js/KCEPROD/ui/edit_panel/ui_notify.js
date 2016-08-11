/*
 * @Author: Vaninadh
 * @Date:   2016-05-05 16:02:54
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-09 11:01:01
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var noty = require('noty');
    var ns = window.kc.ns;
    return defineComponent(uiNotify);

    function uiNotify() {
        this.attributes({
            notifyOp: '',
            notifyConfirm: ''
        });

        this.activateNotifyOp = function(e, data) {
            var defaultValue = {
                text: 'success',
                type: 'success'
            };
            var option = $.extend({}, defaultValue, data);

            this.attr.notifyOp = noty({
                template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
                text: option.text,
                layout: 'topCenter',
                type: option.type,
                timeout: '2000',
                animation: {
                    open: 'animated flipInX', // Animate.css class names
                    close: 'animated flipOutX', // Animate.css class names
                    easing: 'swing', // unavailable - no need
                    speed: 500 // unavailable - no need
                }
            });
        }

        this.activateNotifyConfirm = function(e, data) {
            var defaultValue = {
                text: '确定要删除么？',
                type: 'info'
            };
            var option = $.extend({}, defaultValue, data);

            this.attr.notifyConfirm = noty({
                template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
                text: option.text,
                layout: 'topCenter',
                type: option.type,
                modal: true,
                animation: {
                    open: 'animated flipInX', // Animate.css class names
                    close: 'animated flipOutX', // Animate.css class names
                    easing: 'swing', // unavailable - no need
                    speed: 500 // unavailable - no need
                },
                buttons: [{
                    addClass: 'btn btn-primary',
                    text: '确定',
                    onClick: function($noty) {
                        // this = button element
                        // $noty = $noty element
                        $noty.close();
                        option.confirmCallBk();
                    }
                }, {
                    addClass: 'btn btn-danger',
                    text: '取消',
                    onClick: function($noty) {
                        $noty.close();
                    }
                }]
            });
        }

        this.activateNofityInfoConfirm = function(e, data) {
            var defaultValue = {
                text: '消息',
                type: 'info'
            };
            var option = $.extend({}, defaultValue, data);

            this.attr.notifyConfirm = noty({
                template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
                text: option.text,
                layout: 'topCenter',
                type: option.type,
                modal: true,
                animation: {
                    open: 'animated flipInX', // Animate.css class names
                    close: 'animated flipOutX', // Animate.css class names
                    easing: 'swing', // unavailable - no need
                    speed: 500 // unavailable - no need
                },
                buttons: [{
                    addClass: 'btn btn-primary',
                    text: '确定',
                    onClick: function($noty) {
                        // this = button element
                        // $noty = $noty element
                        $noty.close();
                    }
                }]
            });
        }

        this.after('initialize', function() {
            console.log("uiNotify is ok!");
            this.on(document, ns.e.canvas.uiNotifyOp, this.activateNotifyOp);
            this.on(document, ns.e.canvas.uiNotifyConfirm, this.activateNotifyConfirm);
            this.on(document, ns.e.canvas.uiNotifyInfoConfirm, this.activateNofityInfoConfirm);
        });
    }
})
