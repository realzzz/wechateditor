var containerOp = require('../container/container');
var textOp = require('../element/element_text');
var templateOp = require('../element/element_template')
var inlineblockOp = require('../element/element_inlineblock')
var imageOp = require('../element/element_image')
var extOp = require('../element/element_ext')
var decorOp = require('../element/element_decor')

var getNodeOperater = function getNodeOperater(type) {
    if (type === undefined) {
        return undefined;
    }

    var targetOp = undefined;
    switch (type) {
        case "container":
            targetOp = containerOp;
            break;

        case "text":
            targetOp = textOp;
            break;

        case "template":
            targetOp = templateOp;
            break;

        case "inline":
            targetOp = inlineblockOp;
            break;

        case "image":
            targetOp = imageOp;
            break;
        case "ext":
            targetOp = extOp;
            break;
        case "decor":
            targetOp = decorOp;
            break;
            // TODOTODOTODO - add more ops
    }
    return targetOp;
}

module.exports.createNode = function createNode(type, attrs, callback) {
    var op = getNodeOperater(type);
    op.create(attrs, {
        success: function onSuccess(createdNode) {
            callback.success(createdNode);
        },
        error: function onError(create_error) {
            console.log("create node error type" + type + " error msg :" + create_error.message);
            var err = new Error('create node eror');
            callback.error(err);
        }
    });
}

module.exports.updateNode = function updateNode(node, attrs, callback) {
    var op = getNodeOperater(node["kctype"]);
    op.update(node, attrs, {
        success: function onSuccess(updatedNode) {
            callback.success(updatedNode);
        },
        error: function onError(update_error) {
            console.log("update node error type" + node["kctype"] + " error msg :" + update_error.message);
            var err = new Error('update node eror');
            callback.error(err);
        }
    });
}

// attrObj is a json object for node's attributes
module.exports.render = function render(node, callback) {
    var op = getNodeOperater(node["kctype"]);
    if (op === undefined) {
        var error = new Error("not support node");
        callback.error(error);
        return;
    }

    op.render(node, {
        success: function onSuccess(html) {
            callback.success(html);
        },
        error: function onError(render_error) {
            console.log("render node error type" + node["kctype"] + " error msg :" + render_error.message);
            var err = new Error('render node eror');
            callback.error(err);
        }
    });
}
