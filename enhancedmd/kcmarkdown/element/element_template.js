var cheerio = require('cheerio')
var mysql = require('../../util/mysql');
var cherrutil = require('../common/cherrutil');
var util = require('../common/util');
var nodemngr = require('../engine/engine_node_manager')
var cssGenerator = require('../common/cssGenerator')

var isAttributes = function isAttributes(key) {
    if (key == undefined)
        return false;

    if (key === "tid" || key === "kctype") {
        return false;
    } else {
        return true;
    }
}

module.exports.create = function create(attrs, callback) {

    // well kctype template no longer exists - everything is treat as container + image + text
    var contentObj = {};

    // fetch template id
    if (attrs == undefined || attrs["tid"] == undefined) {
        var err = new Error("Create template parameter error");
        callback.error(err);
    }

    // fetch template from db
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            // TODO - make it parameter query
            conn.query("select * from kcmd_template where id =\'" + attrs["tid"] + "\' ", function(err, rows, fields) {
                if (err) {
                    callback.error(err);
                } else {
                    if (rows[0] == undefined) {
                        var notexisterr = new Error('template does not exist');
                        callback.error(notexisterr);
                    }
                    else{
                        content = rows[0]['content'];
                        contentObj = JSON.parse(content);
                        var keysOfAttr = Object.keys(attrs);
                        for (var i = 0; i < keysOfAttr.length; i++) {
                            var attr = keysOfAttr[i];
                            if (attr != 'style') {
                                contentObj[attr.trim()] = attrs[attr];
                            }
                            else{
                                var styleValueObject = contentObj['style'];
                                if (styleValueObject == undefined) {
                                    contentObj[attr] = attrs[attr];
                                }
                                else{
                                    tmpvalue = attrs[attr];
                                    var keysOfTmpAttr = Object.keys(tmpvalue);
                                    for (var j = 0; j < keysOfTmpAttr.length; j++) {
                                        if (!util.isEmptyStr(tmpvalue[keysOfTmpAttr[j]])) {
                                            styleValueObject[keysOfTmpAttr[j].trim()] = tmpvalue[keysOfTmpAttr[j]];
                                        }
                                    }
                                }
                            }
                        }
                        callback.success(contentObj);
                    }
                }
                conn.release();
            });
        }
    });

}

module.exports.update = function update(node, attrs, callback) {
    // update - simple replace the attribute values for now
    var keysOfAttr = Object.keys(attrs);
    for (var i = 0; i < keysOfAttr.length; i++) {
        var attr = keysOfAttr[i];
        node[attr] = attrs[attr];
    }
    callback.success(node);
}

// IMPARTANT - there should not be any template render
module.exports.render = function render(node, callback) {
    // fetch template from db
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            // TODO - make it parameter query
            conn.query("select * from kcmd_template where id =\'" + node["tid"] + "\' ", function(err, rows, fields) {
                if (err) {
                    callback.error(err);
                } else {
                    if (rows[0] == undefined) {
                        var notexisterr = new Error('template does not exist');
                        callback.error(notexisterr);
                    }
                    else{
                        content = rows[0]['content'];
                        // this is html and we need to render it.
                        // iterate through the attr
                        var keysOfNode = Object.keys(node);
                        for (var i = 0; i < keysOfNode.length; i++) {
                            var attr = keysOfNode[i];
                            if (isAttributes(attr)) {
                                if(node[attr]!= undefined && (typeof node[attr] === 'string')){
                                    if (attr === 'style'){
                                        // don't do anything here
                                    }
                                    else if (node[attr].substring(0,1) === "@"){
                                        var inlineObject = JSON.stringify(attr.substring(1));
                                        var objHtml = nodemngr.render(inlineObject);
                                        content = cherrutil.appendObjectToHtml(content, attr, objHtml);

                                        // TODOTODOTODO - think about it , this can be appended to remove object
                                    }
                                    else{
                                        content = cherrutil.attachAttrToHtml(content, attr, node[attr]);
                                    }
                                }
                            }
                        }

                        $ = cheerio.load("<section kctype='template' class=\'kc-dashed\' > </section>");

                        // attach the attributes - style for now
                        $('section').attr('style', cssGenerator.buildFromJsonObject(node['style']));
                        $('section').attr('tid', node['tid']);
                        if(node["id"] != undefined){
                            $('section').attr('id', node["id"]);
                        }
                        // attach the content - it's important to attch the content after attributes set
                        $('section').append(content);
                        callback.success($.html());
                    }
                }
                conn.release();
            });
        }
    });
}
