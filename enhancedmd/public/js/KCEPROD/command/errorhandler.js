/*
 * @Author: Vaninadh
 * @Date:   2016-04-05 17:30:52
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-05 19:14:25
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;

    return defineComponent(errorhandler);

    function errorhandler() {
        this.attributes({});

        this.handleError = function (e, data){
            console.log(data[window.kc.ns.k.error_message]);
            if (data[window.kc.ns.k.error_operation] == "render inlinblock") {
                this.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                    text:'制作失败! 请复制微信文章片段，不要直接输入',
                    type:'error'
                });
            }
        }

        this.after("initialize", function() {
            this.on(document, ns.e.generalError, this.handleError);
        });
    }
});
