// NOTE EACH ELEMENT REQUIRES TO HAVE FOLLOWING things
// all supported attributes
// 1 - create
// 2 - update
// 3 - render
// define of callback has two functions success(obj) or error(err)
var cheerio = require('cheerio')
var cssGenerator = require('../common/cssGenerator');
var jsonutil = require('../common/jsonutil')


module.exports.create = function create(attrs, callback) {
    var contentObj = {
        "kctype": "text",
        "tagName": "section",
        "value": "",
        "chtrstyle": {}
    };
    var keysOfAttr = Object.keys(attrs);
    for (var i = 0; i < keysOfAttr.length; i++) {
        var attr = keysOfAttr[i];
        contentObj[attr.trim()] = attrs[attr];
    }
    callback.success(contentObj);
}

module.exports.update = function update(node, attrs, callback) {
    var keysOfAttr = Object.keys(attrs);
    for (var i = 0; i < keysOfAttr.length; i++) {
        var attr = keysOfAttr[i];
        if (attr !== 'style' && attr !== 'chtrstyle' && attr !== 'textchange') {
            node[attr.trim()] = attrs[attr];
        } else {
            if (attr === 'textchange') {
                var textchangeattr = attrs[attr];
                var keysOfTextChangeAttr = Object.keys(textchangeattr);
                if (keysOfTextChangeAttr.length == 1) {
                    var changeRange = keysOfTextChangeAttr[0];
                    var changetext = textchangeattr[changeRange];
                    var changeRangeArray = changeRange.split('-');
                    if (changeRangeArray.length == 2) {
                        var startIdx = parseInt(changeRangeArray[0]);
                        var endIdx = parseInt(changeRangeArray[1]);
                        var currentctrstyle = node["chtrstyle"];
                        var keysOfCurrentCtr = Object.keys(currentctrstyle);

                        // first walkthrough the chtrstyle to remove the items that is no longer existing
                        if (startIdx <= endIdx) {
                            for (var j = keysOfCurrentCtr.length - 1; j >= 0; j--) {
                                var tmpctrkey = keysOfCurrentCtr[j];
                                var tmpctrkeyArray = tmpctrkey.split('-');
                                var tmpstartIdx = parseInt(tmpctrkeyArray[0]);
                                var tmpendIdx = parseInt(tmpctrkeyArray[1]);
                                // completely contain -> delete
                                if (startIdx <= tmpstartIdx && endIdx >= tmpendIdx) {
                                    delete currentctrstyle[tmpctrkey];
                                }
                                // inside range -> split to two range
                                else if (startIdx >= tmpstartIdx && endIdx <= tmpendIdx) {
                                    var pruneOldKey = false;
                                    var tmpstyle = currentctrstyle[tmpctrkey];
                                    if (tmpstartIdx != startIdx && startIdx != tmpendIdx) {
                                        pruneOldKey = true;
                                        currentctrstyle[tmpstartIdx + "-" + startIdx] = tmpstyle;
                                    }
                                    if (tmpendIdx != endIdx && endIdx != tmpstartIdx) {
                                        pruneOldKey = true;
                                        currentctrstyle[endIdx + "-" + tmpendIdx] = tmpstyle;
                                    }
                                    if (pruneOldKey) {
                                        delete currentctrstyle[tmpctrkey];
                                    }
                                }
                                // second half match - not tmp is style range
                                else if (startIdx >= tmpstartIdx && startIdx < tmpendIdx) {
                                    if (startIdx != tmpstartIdx) {
                                        var updateIdxKey = tmpstartIdx + "-" + startIdx;
                                        var tmpstyle = currentctrstyle[tmpctrkey];
                                        currentctrstyle[updateIdxKey] = tmpstyle;
                                    }
                                    delete currentctrstyle[tmpctrkey];
                                }
                                // first half match
                                else if (endIdx <= tmpendIdx && endIdx > tmpstartIdx) {
                                    if (endIdx != tmpendIdx) {
                                        var updateIdxKey = tmpendIdx + "-" + endIdx;
                                        var tmpstyle = currentctrstyle[tmpctrkey];
                                        currentctrstyle[updateIdxKey] = tmpstyle;
                                    }
                                    delete currentctrstyle[tmpctrkey];
                                }
                                // whole range in advance
                                else if (endIdx <= tmpstartIdx) {
                                    var deleteLength = endIdx - startIdx;
                                    if (deleteLength > 0) {
                                        var updatestartidx = tmpstartIdx - deleteLength;
                                        var updateendidx = tmpendIdx - deleteLength;
                                        var updateIdxKey = updatestartidx + "-" + updateendidx;
                                        var tmpstyle = currentctrstyle[tmpctrkey];
                                        currentctrstyle[updateIdxKey] = tmpstyle;
                                        delete currentctrstyle[tmpctrkey];
                                    }
                                }
                            }
                        }
                        // then add the inserted character's influence on range
                        var insertlength = (textchangeattr[changeRange]).length;
                        if (insertlength > 0) {
                            keysOfCurrentCtr = Object.keys(currentctrstyle);
                            for (var j = keysOfCurrentCtr.length - 1; j >= 0; j--) {
                                var tmpctrkey = keysOfCurrentCtr[j];
                                var tmpctrkeyArray = tmpctrkey.split('-');
                                var tmpstartIdx = parseInt(tmpctrkeyArray[0]);
                                var tmpendIdx = parseInt(tmpctrkeyArray[1]);
                                if (tmpstartIdx >= startIdx) {
                                    var tmpstyle = currentctrstyle[tmpctrkey];
                                    var newstartidx = tmpstartIdx + insertlength;
                                    var newendidx = tmpendIdx + insertlength;
                                    currentctrstyle[newstartidx + "-" + newendidx] = tmpstyle;
                                    delete currentctrstyle[tmpctrkey];
                                }
                            }
                        }

                        // finally dude - plz change the text!
                        var textvalue = node["value"];
                        var newtextvalue = textvalue.substring(0, startIdx) + changetext + textvalue.substring(endIdx);
                        node["value"] = newtextvalue;
                    }
                }
            } else if (attr === 'chtrstyle'){
                var targetstyle = node[attr];
                var updatestyle = attrs[attr];
                var keysOfStyleAttr = Object.keys(updatestyle);
                for (var p = 0; p < keysOfStyleAttr.length; p++) {
                    var attrStyleRange = keysOfStyleAttr[p];
                    var attrStylekeyArray = attrStyleRange.split('-');
                    var updateStartIdx = parseInt(attrStylekeyArray[0]);
                    var updateEndIdx = parseInt(attrStylekeyArray[1]);
                    if (updateStartIdx<updateEndIdx){
                        if (updatestyle[attrStyleRange] === "") {
                            // this meas clear styles for this range
                            delete targetstyle[attrStyleRange];
                            var keysOfCurrentCtr = Object.keys(targetstyle);
                            for (var q = keysOfCurrentCtr.length - 1; q >= 0; q--) {
                                var tmpctrkey = keysOfCurrentCtr[q];
                                var tmpctrkeyArray = tmpctrkey.split('-');
                                var tmpstartIdx = parseInt(tmpctrkeyArray[0]);
                                var tmpendIdx = parseInt(tmpctrkeyArray[1]);
                                if (updateStartIdx <= tmpstartIdx && updateEndIdx >= tmpendIdx) {
                                    delete targetstyle[tmpctrkey];
                                }
                                else if (updateStartIdx >= tmpstartIdx && updateEndIdx <= tmpendIdx){
                                    if (updateStartIdx != tmpstartIdx){
                                        targetstyle[tmpstartIdx + '-' + updateStartIdx] = targetstyle[tmpctrkey];
                                    }
                                    if (updateEndIdx != tmpendIdx){
                                        targetstyle[updateEndIdx + '-' + tmpendIdx] = targetstyle[tmpctrkey];
                                    }
                                    delete targetstyle[tmpctrkey];
                                }
                                else if (updateStartIdx >= tmpstartIdx && updateStartIdx < tmpendIdx){
                                    targetstyle[tmpstartIdx + '-' + updateStartIdx] = targetstyle[tmpctrkey];
                                    delete targetstyle[tmpctrkey];
                                }
                                else if (updateEndIdx >= tmpstartIdx && updateEndIdx < tmpendIdx){
                                    targetstyle[updateEndIdx + '-' + tmpendIdx] = targetstyle[tmpctrkey];
                                    delete targetstyle[tmpctrkey];
                                }
                            }
                        } else {
                            // damn complex
                            var targetStyleValueObj = {};
                            if (targetstyle[attrStyleRange] == undefined) {
                                targetstyle[attrStyleRange] = targetStyleValueObj;
                            }
                            else{
                                targetStyleValueObj = targetstyle[attrStyleRange];
                            }
                            var updateStyleRange =  updatestyle[attrStyleRange];
                            var keysOfUpdateRange = Object.keys(updateStyleRange);
                            for (var b = 0; b < keysOfUpdateRange.length; b++) {
                                targetStyleValueObj[keysOfUpdateRange[b]] = updateStyleRange[keysOfUpdateRange[b]];
                            }
                            //targetstyle[attrStyleRange] = updatestyle[attrStyleRange];
                        }
                    }
                }
            } else {
                var targetstyle = node[attr];
                if(targetstyle == undefined){
                    node[attr] = {};
                    targetstyle = node[attr];
                }
                var updatestyle = attrs[attr];
                var keysOfStyleAttr = Object.keys(updatestyle);
                for (var j = 0; j < keysOfStyleAttr.length; j++) {
                    var attrStyleRange = keysOfStyleAttr[j];
                    var attrStylekeyArray = attrStyleRange.split('-');
                    if (attrStylekeyArray.length == 1 || !parseInt(attrStylekeyArray[0])  ) {
                        if (updatestyle[attrStyleRange] == "") {
                            delete targetstyle[attrStyleRange];
                        }
                        else{
                            targetstyle[attrStyleRange] = updatestyle[attrStyleRange];
                        }
                    }
                    else{
                        var updateStartIdx = parseInt(attrStylekeyArray[0]);
                        var updateEndIdx = parseInt(attrStylekeyArray[1]);
                        if (updateStartIdx<updateEndIdx){
                            if (updatestyle[attrStyleRange] === "") {
                                // this meas clear styles for this range
                                delete targetstyle[attrStyleRange];
                            } else {
                                targetstyle[attrStyleRange] = updatestyle[attrStyleRange];
                            }
                        }
                    }

                }
            }
        }
    }
    callback.success(node);
}

module.exports.render = function render(node, callback) {
    if (node == undefined) {
        var err = new Error("empty node to render");
        callback.error(err);
    }

    var innerHtml = "";
    // walk through the value
    var textvalue = node["value"];
    var currentset = [];
    var currentstyle = {};
    var rawid = 0;
    for (var i = 0; i < textvalue.length; i++) {
        // first fetch all the styles belongs to him
        var chtrstyleAttr = node["chtrstyle"];
        var keysOfChtrStyleAttr = Object.keys(chtrstyleAttr);
        var nextstyle = {}

        for (var j = 0; j < keysOfChtrStyleAttr.length; j++) {
            var rangeOfChtrStyle = keysOfChtrStyleAttr[j];
            var changeRangeArray = rangeOfChtrStyle.split('-');
            if (changeRangeArray.length == 2) {
                var startIdx = parseInt(changeRangeArray[0]);
                var endIdx = parseInt(changeRangeArray[1]);
                if (startIdx <= i && endIdx > i) {
                    //found a match, let's deal with it
                    var tmpstyles = chtrstyleAttr[rangeOfChtrStyle];
                    var tmpstylekeys = Object.keys(tmpstyles);
                    for (var m = 0; m < tmpstylekeys.length; m++) {
                        var tmpstylekey = tmpstylekeys[m];
                        nextstyle[tmpstylekey] = tmpstyles[tmpstylekey];
                    }
                }
            }
        }

        // compare with previous
        if (currentset.length == 0) {
            currentset.push(i);
            currentctrstyle = nextstyle;
        } else {
            if (jsonutil.simpleCompareJsonObject(currentctrstyle, nextstyle)) {
                currentset.push(i);
            } else {
                // render current style
                var finishedHtml = renderRangeOfText(node, currentset, currentctrstyle, rawid);
                rawid++;
                innerHtml += finishedHtml;
                currentset = [];
                currentset.push(i);
                currentctrstyle = nextstyle;
            }
        }

        // remember to draw the last range section
        if (i + 1 == textvalue.length) {
            var finishedHtml = renderRangeOfText(node, currentset, currentctrstyle, rawid);
            rawid++;
            innerHtml += finishedHtml;
        }
    }

    var tagN = node['tagName'];
    if (tagN == undefined ) {
        tagN = "section";
    }
    var textDecor =  textvalue.length == 0 ? "kc-empty":"";
    $ = cheerio.load("<"+tagN+" kctype='text' contenteditable=\"true\"  class=\'" + textDecor +  " kc-editable\' ></"+tagN+">");
    // attach other attributes
    var keysOfNode = Object.keys(node);
    for (var i = 0; i < keysOfNode.length; i++) {
        var tmpkey = keysOfNode[i];
        if (tmpkey !== 'kctype' && tmpkey !== 'style' && tmpkey !== 'chtrstyle' && tmpkey !== 'textchange' && tmpkey !== 'value') {
            $(tagN).attr(tmpkey, node[tmpkey]);
        }

        if (tmpkey === 'style'){
            var stylestr = cssGenerator.buildFromJsonObject(node[tmpkey]);
            if (node['style']['top'] != undefined || node['style']['left'] != undefined) {
                stylestr += "position:relative;"
            }
            $(tagN).attr(tmpkey, stylestr);

        }
    }

    // attach the content
    $(tagN).append(innerHtml);

    // todo - more attributes
    callback.success($.html());
}

var renderRangeOfText = function(node, range, attrs, rawid) {
    var startidx = range[0];
    var endidx = range[range.length - 1] + 1;
    var rangetext = node["value"].substring(startidx, endidx);

    if (rangetext != null) {
        $ = cheerio.load("<span></span>");
        // first add range info
        $('span').attr('rawid', rawid.toString());
        $('span').attr('range', startidx + '-' + endidx);
        $('span').text(rangetext);
        $('span').attr('style', cssGenerator.buildFromJsonObject(attrs));
    }
    return $.html();
}
