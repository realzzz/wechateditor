var env = require('./env.json');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return env[node_env];
};

exports.guild = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4()  + s4()  +
    s4()  + s4() + s4() + s4();
}

exports.isEmptyStr = function isEmptyStr(str) {
    return (!str || 0 === str.length);
}

exports.deepCloneObject = function deepCloneObject(jsonObj){
    var jsonStr = JSON.stringify(jsonObj);
    var clonedJsonObj = JSON.parse(jsonStr);
    return clonedJsonObj;
}

// actually most of the work belongs to text element
exports.getOriValueOfNodeObject = function getOriValueOfNodeObject(node, attr){
    var attrArr = Object.keys(attr);
    var oriAttr = {};
    for (var i = 0; i < attrArr.length; i++) {
        var tmpkey = attrArr[i];
        if (tmpkey != "style" && tmpkey !== 'chtrstyle' && tmpkey !== 'textchange' ) {
            if (node[tmpkey] == undefined) {
                oriAttr[tmpkey] = "";
            }
            else{
                oriAttr[tmpkey] = node[tmpkey];
            }
        }
        else{
            if (tmpkey === 'style') {
                var oldStyleAttr = node[tmpkey];
                var styleAttr = attr[tmpkey];
                var styleAttrArr = Object.keys(styleAttr);
                var oriStyleAttr = {};
                for (var j = 0; j < styleAttrArr.length; j++) {
                    var sattr = styleAttrArr[j];
                    if (oldStyleAttr == undefined || oldStyleAttr[sattr] == undefined) {
                        oriStyleAttr[sattr] = "";
                    }
                    else{
                        oriStyleAttr[sattr] = oldStyleAttr[sattr];
                    }
                }
                oriAttr[tmpkey]=oriStyleAttr;
            }
            else if (tmpkey === 'chtrstyle') {
                var oldStyleAttr = node[tmpkey];
                var styleAttr = attr[tmpkey];
                var oriStyleAttr = {};

                if (styleAttr === "") {
                    if (oldStyleAttr == undefined || oldStyleAttr[sattr] == undefined) {
                        oriStyleAttr[sattr] = "";
                    }
                    else{
                        oriStyleAttr[tmpkey] = oldStyleAttr[tmpkey];
                    }
                }
                else{
                    var styleAttrArr = Object.keys(styleAttr);

                    for (var j = 0; j < styleAttrArr.length; j++) {
                        var sattr = styleAttrArr[j];
                        if (oldStyleAttr == undefined || oldStyleAttr[sattr] == undefined) {
                            oriStyleAttr[sattr] = "";
                        }
                        else{
                            var hisinsiderAttrObj = {};
                            var updateinsiderAttrObj = styleAttr[sattr];
                            var oldinsideAttrObj = oldStyleAttr[sattr];
                            if (updateinsiderAttrObj === "") {
                                oriStyleAttr[sattr] = oldStyleAttr[sattr];
                            }
                            else{
                                var updateinsiderAttrArr = Object.keys(updateinsiderAttrObj);
                                for (var n = 0; n < updateinsiderAttrArr.length;n++) {
                                    var tmpinsideAttrkey = updateinsiderAttrArr[n];
                                    if (oldinsideAttrObj[tmpinsideAttrkey] != undefined) {
                                        hisinsiderAttrObj[tmpinsideAttrkey] = oldinsideAttrObj[tmpinsideAttrkey];
                                    }
                                    else{
                                        hisinsiderAttrObj[tmpinsideAttrkey] = "";
                                    }
                                }
                            }

                            oriStyleAttr[sattr] = hisinsiderAttrObj;
                        }
                    }
                }

                oriAttr[tmpkey]=oriStyleAttr;
            }
            else{
                // get reverse of text change
                var oritxtChangeObj = {};
                var textChangeAttr = attr[tmpkey];
                var txtchangeAttrArr = Object.keys(textChangeAttr);
                for (var m = 0; m < txtchangeAttrArr.length; m++) {
                    var tmptxtChangeAttr = txtchangeAttrArr[m];
                    var tmptxtChangeValue = textChangeAttr[tmptxtChangeAttr];
                    var tmpchangerangeArr = tmptxtChangeAttr.split('-');
                    var tmpchangeStart = parseInt(tmpchangerangeArr[0]);
                    var tmpchangeEnd = parseInt(tmpchangerangeArr[1]);

                    var orichangeend = tmpchangeStart+tmptxtChangeValue.length;

                    var newTxtChangeAttr = tmpchangerangeArr[0] + '-' + orichangeend;
                    var newTxtChangeValue = node['value'].substr(tmpchangeStart, tmpchangeEnd - tmpchangeStart);
                    oritxtChangeObj[newTxtChangeAttr] = newTxtChangeValue;
                }

                oriAttr[tmpkey]=oritxtChangeObj;
            }
        }
    }

    return oriAttr;

}
