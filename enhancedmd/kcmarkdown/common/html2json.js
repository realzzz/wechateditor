var cheerio = require('cheerio');
var nodemanager = require('../engine/engine_node_manager');
var async = require('async');
var util = require('./util');
// consider id please

// TODO things:
// 1. support for text is not good enough a better solution would be
//   Step One: look through element and check out it's text,
//   Step two, walk through the children, add chrstyle and value and offsets one by one

var convert = module.exports.convert = function convert(html, callback) {

    $ = cheerio.load(html);
    var root = $.root()[0];

    var tagCount = 0;
    var firstMetTag = undefined;
    for (var i = 0; i < root.children.length; i++) {
        var tmpChild = root.children[i];
        if(tmpChild.type == "tag"){
            tagCount++;
            if (firstMetTag == undefined) {
                firstMetTag = tmpChild;
            }
        }
    }

    var finalTag = undefined;

    if (tagCount > 0 && root.type == "tag") {
        finalTag = root;
    }
    else if (tagCount > 1 && root.type == "root") {

        var newhtml = "<section style='minheight: 5px'></section>";
        var loader = cheerio.load(newhtml);
        loader('section').append(html);

        finalTag = loader.root()[0].children[0];
    }
    else if (tagCount == 1 && root.type == "root"){
        finalTag = firstMetTag;
    }

    constructJsonObj(finalTag, {
        success: function(finalObj){
            callback.success(finalObj);
        },
        error: function(err){
            callback.error(err);
        }
    });
}


var constructJsonObj = module.exports.constructJsonObj = function constructJsonObj(childNode, callback) {
    var resultObj = {};

    var childNodeCount = 0;
    var textNodeCount = 0;
    var decorNodeCount = 0;
    var spanCount = 0;
    // well default type to container
    var kctype = "container";

    var attrObject = {};

    if (childNode == undefined) {
        callback.error(new Error("empty childNode"));
        return;
    }

    // I mean this can have all different kinds of strategies, i'm just using the simpliest one here, can be extended later on
    if (childNode.name == "img") {
        kctype = "image";
    }
    else if(childNode.name == "br"){
        kctype = "decor";
    }
    else {
        for (var i = 0; i < childNode.children.length; i++) {
            var tmpChild = childNode.children[i];
            if (tmpChild.type == "text" ) {
                var tmpdata = tmpChild.data;
                if (tmpdata == undefined) {
                    continue;
                }
                var replacedData = tmpdata.replace(/\t/g, '').replace(/\s+/g, '');
                if (replacedData.length > 0) {
                    textNodeCount++;
                }
            }
            else{
                if (tmpChild.type == "tag" && tmpChild.name != "br") {
                    childNodeCount++;
                }

                if (tmpChild.name == "br") {
                    decorNodeCount++;
                }

                if (tmpChild.name == "span" || tmpChild.name == "strong" || tmpChild.name == "em") {
                    spanCount++;
                }
            }
        }
        if (childNodeCount > 0) {
            kctype = "container";
            if (spanCount == childNodeCount) {
                attrObject['direction']='f';
            }
        }
        else{
            if (textNodeCount > 0) {
                if (decorNodeCount == 0) {
                    kctype = "text";
                }
                else {
                    kctype = "container";
                    if (childNode.name == "span" || childNode.name == "strong" || tmpChild.name == "em"){
                        attrObject['direction']='f';
                    }
                }
            }
            else if(decorNodeCount > 0){
                kctype = "decor";
            }
            else{
                kctype = "container";
                // var err = new Error('ingore this node due to not able to recognize');
                // callback.error();
                // return;
            }
        }
    }

    // then gather the attributes and construct yourself

    var attrKeys = Object.keys(childNode.attribs);
    for (var i = 0; i < attrKeys.length; i++) {
        var tmpkey = attrKeys[i];
        var tmpvalue = childNode.attribs[tmpkey];
        if (tmpkey != "style") {
            // ignore these two attributes
            if (tmpkey == "kctype" || tmpkey == "id") {
                continue;
            }
            else{
                attrObject[tmpkey.trim()]=tmpvalue;
            }
        }
        else{

            var styleValueObject = {};
            var arrOfStyle = tmpvalue.split(';')
            for (var j = 0; j < arrOfStyle.length; j++) {
                var kvArray = arrOfStyle[j].split(':');
                if (kvArray.length == 2) {
                    var key = kvArray[0].trim();
                    // setting MAX width to 400 - this is our canvas width do DO NOT OVER VALUE IT
                    if (key === 'width') {
                        changed = false;
                        var value = kvArray[1].trim();
                        if (value.indexOf('px') > -1) {
                            valuestr = value.substring(0, value.indexOf('px'));
                            valueint = parseInt(valuestr);
                            if (valueint > -1 && valueint > 400) {
                                valueint = 400;
                                valstr = key + ': ' +valueint.toString() + 'px';
                                styleValueObject[key] = valstr;
                                changed = true;
                            }
                        }
                        if (!changed) {
                            styleValueObject[key] = kvArray[1];
                        }
                    }
                    else{
                        styleValueObject[key] = kvArray[1];
                    }

                }
                else if (kvArray.length > 2){
                    var vstr = kvArray[1];
                    for (var m = 2; m < kvArray.length; m++) {
                        vstr = vstr+':'+kvArray[m];
                    }
                    styleValueObject[kvArray[0].trim()] = vstr;
                }
            }
            attrObject[tmpkey]= styleValueObject;
        }
    }

    // I don't really know if this fits to all scenarios, but let's make it like this now, will see how it goes
    var targetTag = childNode.name;
    attrObject['tagName']=targetTag;

    if (kctype == "text") {
        if (childNode.children.length > 0) {
            var valuestr = "";
            for (var i = 0; i < childNode.children.length; i++) {
                valuestr += childNode.children[i].data.trim().replace('\t', '');
            }
            attrObject['value']=valuestr;
        }
    }

    async.waterfall([
        // first create the node
        function(ac_callback){
            nodemanager.createNode(kctype, attrObject, {
                success: function(newnode){
                    ac_callback(null, newnode);
                },
                error: function(err){
                    ac_callback(err);
                }
            });
        },
        function(node, ac_callback){
            var arrayOfItems = [];
            if(kctype == "container"){
                async.forEachOf(childNode.children, function (v, key, cb) {
                    if (v.type == "text") {
                        if (v.data != undefined) {
                            var valuestr = v.data.trim().replace('\t', '');
                            if (!util.isEmptyStr(valuestr)) {
                                var newAttrObj = {};
                                newAttrObj['value']=valuestr;
                                newAttrObj['tagName']='span';
                                nodemanager.createNode("text", newAttrObj, {
                                    success: function(newnode){
                                        newnode['sortkey'] = key;
                                        arrayOfItems.push(newnode);
                                        cb();
                                    },
                                    error: function(err){
                                        cb();
                                    }
                                });
                            }else{
                                cb();
                            }
                        }
                        else{
                            cb();
                        }
                    }
                    else if(v.type == "tag") {
                        constructJsonObj(v, {
                            success: function (newnode){
                                newnode['sortkey'] = key;
                                arrayOfItems.push(newnode);
                                cb();
                            },
                            error: function (err){
                                cb();
                            }
                        });
                    }
                    else{
                        cb();
                    }
                }, function (err) {
                    if (err) console.error(err.message);
                    else{
                        // lets sort it
                        arrayOfItems.sort(function(a,b){
                            return a['sortkey']-b['sortkey'];
                        });

                        // then add id & remove sortkee
                        var tagCount = {};
                        for (var i = 0; i < arrayOfItems.length; i++) {
                            var titem = arrayOfItems[i];
                            var tkctype = titem['kctype'];
                            if (tagCount[tkctype] == undefined) {
                                tagCount[tkctype] = 0;
                                titem['id']=0;
                            }
                            else{
                                tagCount[tkctype] = tagCount[tkctype] +1;
                                titem['id']=tagCount[tkctype];
                            }

                            delete titem['sortkey'];
                        }
                    }
                    ac_callback(null, node, arrayOfItems);
                });
            }
            else {
                ac_callback(null, node, null);
            }
        },
        function(node, arrayOfItems, ac_callback){
            if (kctype == "container") {
                node['items'] = arrayOfItems;
                // check h/v for items
                // disable this for now - it's possible to have some inline-block items with vertical layout
                /*
                for (var i = 0; i < arrayOfItems.length; i++) {
                    var tmpitem = arrayOfItems[i];
                    if (tmpitem['style'] != undefined) {
                        var tstyle = tmpitem['style'];
                        if (tstyle['display'] != undefined) {
                            var tdisplay = tstyle['display'];
                            if (tdisplay.indexOf('inline-block') >= 0) {
                                node['direction'] = 'h';
                                break;
                            }
                        }
                    }
                }
                */
                ac_callback(null, node);
            }
            else {
                ac_callback(null, node);
            }
        },
    ],function(err, node){
        if (err) {
            callback.error(err);
        }
        else{
            callback.success(node);
        }
    });




}
