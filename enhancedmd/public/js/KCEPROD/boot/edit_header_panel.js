/*
* @Author: Vaninadh
* @Date:   2016-03-29 15:42:42
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-04-05 17:48:40
*/

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;
    return defineComponent(editHeaderPanel);

    function editHeaderPanel() {
        this.attributes({
        	//deleteSelector:".actIcon4"
        });
        this.deleteElement=function(e,data){
        	this.trigger(ns.e.command.uiDeleteableExecute);
        }
        this.after('initialize', function() {
        	console.log("editHeaderPanel is ok!");
        	//this.on('click',{
        	//	deleteSelector:this.deleteElement
        	//});
        });
    }
});
