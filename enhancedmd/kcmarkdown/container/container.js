// NOTE CONTAINER REQUIRES TO HAVE FOLLOWING things
// all supported attributes
// 1 - create
// 2 - update
// 3 - render -> should ask element to render when encounter it
var cssGenerator = require('../common/cssGenerator');
var _ = require("underscore")._;
var async = require('async');
var nodemngr = require('../engine/engine_node_manager');
var cheerio = require('cheerio')


var isAttributes = function isAttributes(key) {
    if (key == undefined)
        return false;

    if (key === "tagName" || key === "style" || key === "items") {
        return false;
    } else {
        return true;
    }
}

// TODO TODO TODO - SUPPORT  list-style-type: "decimal" // initial circle square upper-roman lower-alpha cjk-ideographic
module.exports.create = function create(attrs, callback) {
    var containerObj = {
        tagName: 'section',
        kctype: 'container',
        direction: 'v', // v - vertical  h - horizontal  l - list
        //align: 'left',
        selectable: true,
        style: {
            width: "100%"
        },
        items:[]
    };

    var keysOfAttr = Object.keys(attrs);
    for (var i = 0; i < keysOfAttr.length; i++) {
        var attr = keysOfAttr[i];
        if(attr == 'tagName'){
            if (attrs[attr] == "p"){
                attrs[attr] = "section";
            }
            // Consider it
            /*
            if (attrs[attr] == "span"){
                attrs["direction"] = "f";
            }
            */
        }
        containerObj[attr]= attrs[attr];
    }

    callback.success(containerObj);
}

module.exports.update = function update(node, attrs, callback) {
    var keysOfAttr = Object.keys(attrs);
    for (var i = 0; i < keysOfAttr.length; i++) {
        var attr = keysOfAttr[i];
        if (attr !== 'style') {
            if (attr == 'direction') {
                if (node['root'] == true) {
                    continue;
                }
            }
            if (attrs[attr] === "")
                delete node[attr]
            else
                node[attr] = attrs[attr];
        } else {
            var targetstyle = node[attr];
            if (targetstyle == undefined) {
                targetstyle = {};
                node[attr] = targetstyle;
            }

            var updatestyle = attrs[attr];
            var keysOfStyleAttr = Object.keys(updatestyle);
            for (var j = 0; j < keysOfStyleAttr.length; j++) {
                var attrStyleRange = keysOfStyleAttr[j];
                if (updatestyle[attrStyleRange] === "") {
                    delete targetstyle[attrStyleRange];
                } else {
                    if (attrStyleRange == 'top'|| attrStyleRange == 'left' || attrStyleRange == 'width' || attrStyleRange == 'position') {
                        if (node['root'] == true) {
                            continue;
                        }
                    }
                    targetstyle[attrStyleRange] = updatestyle[attrStyleRange];
                }
            }
        }
    }

    callback.success(node);
}

module.exports.render = function render(node, callback) {
    var  tag = node.tagName;
    if (node.kctype == 'container') {
        var finalhtml = cheerio.load('<' + tag + ' kctype=\'container\' class=\'kc-container kc-dashed\'>' + '</' + tag + '>');
        // setting up normal attrStyleRange
        var keysOfNode = Object.keys(node);
        for (var i = 0; i < keysOfNode.length; i++) {
            var key = keysOfNode[i];
            if(isAttributes(key)){
                finalhtml(tag).attr(key, node[key]);
            }
        }


        // setting up style for container
        var containertyle = "";
        containertyle = cssGenerator.build(node);
        if (node['style']['top'] != undefined || node['style']['left'] != undefined) {
            containertyle += "position:relative;"
        }

        if (node["direction"] === 'h'){
            //var addtionalStyle = 'text-align:' + node['align']+ ';';
            //containertyle += addtionalStyle;
        }
        else if (node["direction"] === 'l'){
            var ulhtml = cheerio.load('<ul> </ul>');
            if (node['list-style-type'] == undefined || node['list-style-type'] == ""){
                ulhtml('ul').attr('style', 'list-style-type: decimal');
            }
            else{
                ulhtml('ul').attr('style', 'list-style-type: '+ node['list-style-type']);
            }
            finalhtml(tag).append(ulhtml.html());
        }
        finalhtml(tag).attr('style',containertyle);
        // putting in children items' html
        async.eachSeries(node["items"], function iteratee(item, as_callback) {
            // existing display always have a higher priority
            // 05-03 hard to say, i'm removing this for now, will see later
            //if (node['style'] == undefined || node['style']['display'] == undefined) {
                if (node["direction"] === 'h'){
                    var styleObj = {};
                    if (item["style"] == undefined){
                        item["style"] = styleObj;
                    }
                    else{
                        styleObj = item["style"];
                    }
                    styleObj["display"] = "inline-block";
                }
                // 05-04 default to display block
                // else if(node["direction"] === 'v'){
                //     var styleObj = {};
                //     if (item["style"] == undefined){
                //         item["style"] = styleObj;
                //     }
                //     else{
                //         styleObj = item["style"];
                //     }
                //     styleObj["display"] = "block";
                // }
            //}

            nodemngr.render(item, {
                success: function(rhtml) {
                    if(node["direction"] === 'l'){
                        var lihtml = '<li>' + rhtml + '</li>';
                        finalhtml('ul').first().append(lihtml);
                    }else{
                        finalhtml(tag).first().append(rhtml);
                    }
                    as_callback(null);
                },
                error: function(err) {
                    as_callback(err);
                }
            });
        }, function done() {
            // ready to go
            callback.success(finalhtml.html());
        });
    }
}
