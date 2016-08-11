/*
 * @Author: Vaninadh
 * @Date:   2016-02-23 15:28:35
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-02-24 14:56:31
 */

module.exports = {


    build: function(obj) {
        var css = obj.style,
            style = '';
        if (css && Object.keys(css).length !== 0) {
            for (var prop in css)
                if (css.hasOwnProperty(prop))
                    style += prop + ': ' + css[prop] + ';';
        }
        //console.log('style:' + style);
        return style;
    },

	buildFromJsonObject: function(jsonObj){
		var style = '';
		if(jsonObj && Object.keys(jsonObj).length !== 0){
			for(var prop in jsonObj)
				if(jsonObj.hasOwnProperty(prop))
					style += prop + ': ' + jsonObj[prop] + ';';
		}
		return style;
	}
}
