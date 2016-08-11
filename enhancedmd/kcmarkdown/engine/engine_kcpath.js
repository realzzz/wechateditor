var fetchNextNodeInPath = function fetchNextNodeInPath(nodeObject, nextPath) {
    var pathattr = nextPath.split(".");
    var typeattr;
    var typeid;
    if (pathattr.length == 1) {
        typeattr = pathattr[0];
        typeid = "0";
    } else {
        typeattr = pathattr[0];
        typeid = pathattr[1];
    }

    if (nodeObject["kctype"] === 'container') {
        var targetItem = undefined;
        for (item of nodeObject["items"]) {
            if (item["kctype"] === typeattr) {
                if (!("id" in item)) {
                    item["id"] = 0;
                }
                if (item["id"] === parseInt(typeid)) {
                    targetItem = item;
                    break;
                }
            }
        }
        return targetItem;
    } else {
        return undefined;
    }
}

var replaceNextNodeInPath = function replaceNextNodeInPath(nodeObject, nextPath, updateNode) {
    var pathattr = nextPath.split(".");
    var typeattr;
    var typeid;
    if (pathattr.length == 1) {
        typeattr = pathattr[0];
        typeid = 0;
    } else {
        typeattr = pathattr[0];
        typeid = pathattr[1];
    }

    if (nodeObject["kctype"] === 'container') {
        var targetItem = undefined;
        for (var i = 0; i < nodeObject["items"].length; i++) {
            var item = nodeObject["items"][i];
            if (item["kctype"] === typeattr) {
                if (!("id" in item)) {
                    item["id"] = 0;
                }
                if (item["id"] === parseInt(typeid)) {
                    targetItem = item;
                    nodeObject["items"][i] = updateNode;
                }
            }
        }

        return targetItem;
    } else {
        return undefined;
    }
}

var insertNodeAfterPath = function insertNodeAfterPath(nodeObject, nextPath, insertNode) {
    var pathattr = nextPath.split(".");
    var typeattr;
    var typeid;

    if (pathattr.length == 1) {
        typeattr = pathattr[0];
        typeid = "0";
    } else {
        typeattr = pathattr[0];
        typeid = pathattr[1];
    }

    if (nodeObject["kctype"] === 'container') {
        var targetidx = -1;
        var targetItem = undefined;

        var preItem = undefined;
        var preItemPath = "";

        // first try to find the element  id
        var maxidx = 0;
        for (var i = 0; i < nodeObject["items"].length; i++) {
            var item = nodeObject["items"][i];
            if (item["kctype"] === insertNode["kctype"]) {
                if (item["id"] === undefined) {
                    item["id"] = 0;
                    maxidx = 1;
                } else {
                    if (maxidx <= item["id"]) {
                        maxidx = item["id"] + 1;
                    }
                }
            }
        }
        if (maxidx != 0) {
            insertNode["id"] = maxidx;
        }

        if (typeattr === "") {
            // if you are the only one
            targetidx = -1;
        } else {
            for (var i = 0; i < nodeObject["items"].length; i++) {
                var item = nodeObject["items"][i];
                if (item["kctype"] === typeattr) {
                    if (!("id" in item)) {
                        item["id"] = 0;
                    }
                    if (item["id"] === parseInt(typeid)) {
                        targetItem = item;
                        targetidx = i;

                        if (i > 0) {
                            preItem = nodeObject["items"][i-1];
                        }
                    }
                }
            }
        }

        nodeObject["items"].splice(targetidx + 1, 0, insertNode);

        if (preItem) {
            var preid = 0;
            if (preItem['id']) {
                preid = preItem['id'];
            }
            preItemPath = preItem['kctype']+'.'+preid;
        }

        return {"insert":insertNode, "preitemPath":preItemPath};
    } else {
        return undefined;
    }
}

var deleteNodeAtPath = function deleteNodeAtPath(nodeObject, nextPath) {
    var pathattr = nextPath.split(".");
    var typeattr;
    var typeid;
    if (pathattr.length == 1) {
        typeattr = pathattr[0];
        typeid = "0";
    } else {
        typeattr = pathattr[0];
        typeid = pathattr[1];
    }

    if (nodeObject["kctype"] === 'container') {
        var targetidx = -1;
        var targetItem = undefined;
        var preItem = undefined;
        var preItemPath = "";
        for (var i = 0; i < nodeObject["items"].length; i++) {
            var item = nodeObject["items"][i];
            if (item["kctype"] === typeattr) {
                if (!("id" in item)) {
                    item["id"] = 0;
                }
                if (item["id"] === parseInt(typeid)) {
                    targetItem = item;
                    targetidx = i;

                    if (i > 0) {
                        preItem = nodeObject["items"][i-1];
                    }
                }
            }
        }
        if (targetidx > -1) {
            nodeObject["items"].splice(targetidx, 1);

            if (preItem) {
                var preid = 0;
                if (preItem['id']) {
                    preid = preItem['id'];
                }
                preItemPath = preItem['kctype']+'.'+preid;
            }

        }

        return {target:targetItem, prepath:preItemPath};
    } else {
        return undefined;
    }
}

var getNodeAtPath = module.exports.getNodeAtPath = function getNodeAtPath(content, kcpath, callback) {
    var nextNode = content;
    // TODO TODO - needs to consider if we allow modification of root nextNode
    if (kcpath == "") {
        callback.success(nextNode);
        return;
    }

    var paths = kcpath.split("#");
    while (paths.length > 0) {
        var nextp = paths.shift();
        nextNode = fetchNextNodeInPath(nextNode, nextp);
        if (nextNode === undefined) {
            break;
        }
    }

    if (nextNode === undefined) {
        var err = new Error("can not find the node");
        callback.error(err);
    } else {
        callback.success(nextNode);
    }
}

var replaceNode = module.exports.replaceNode = function replaceNode(content, kcpath, node, callback) {
    var nextNode = content;
    var paths = kcpath.split("#");
    while (paths.length > 0) {
        var nextp = paths.shift();
        if (paths.length == 0) {
            nextNode = replaceNextNodeInPath(nextNode, nextp, node);
        } else {
            nextNode = fetchNextNodeInPath(nextNode, nextp);
        }

        if (nextNode === undefined) {
            break;
        }
    }

    if (nextNode === undefined) {
        var err = new Error("can not find the node");
        callback.error(err);
    } else {
        callback.success(content);
    }
}


var insertNodeAfter = module.exports.insertNodeAfter = function insertNodeAfter(content, kcpath, node, callback) {
    var nextNode = content;
    var paths = kcpath.split("#");

    if (kcpath.length == 0) {
        // insert the first node of everything
        nextNode = insertNodeAfterPath(nextNode, "", node);
    } else {
        while (paths.length > 0) {
            var nextp = paths.shift();
            if (paths.length == 0) {
                nextNode = insertNodeAfterPath(nextNode, nextp, node);
            } else {
                nextNode = fetchNextNodeInPath(nextNode, nextp);
            }

            if (nextNode === undefined) {
                break;
            }
        }
    }

    if (nextNode === undefined) {
        var err = new Error("can not find the node");
        callback.error(err);
    } else {
        // construct node paths
        var nodeid = node['id'];
        if (nodeid == undefined) {
            nodeid = 0;
        }
        var nodeself = node['kctype'] + '.' + nodeid;
        var nodepath = kcpath;
        var prepath = "";
        if (nodepath == "") {
            nodepath = nodeself;
        }
        else{
            var opaths = nodepath.split("#");
            if (opaths.length>0) {
                opaths.splice(-1,1);
            }
            opaths.push(nodeself);
            nodepath = opaths.join('#');

            var ppaths = nodepath.split("#");
            if (ppaths.length>0) {
                ppaths.splice(-1,1);
            }
            ppaths.push(nextNode['preitemPath']);
            prepath = ppaths.join('#');
        }
        callback.success(content, nodepath, prepath, nextNode['insert']);
    }
}

var deleteNode = module.exports.deleteNode = function deleteNode(content, kcpath, callback) {
    var nextNode = content;
    var paths = kcpath.split("#");
    while (paths.length > 0) {
        var nextp = paths.shift();
        if (paths.length == 0) {
            nextNode = deleteNodeAtPath(nextNode, nextp);
        } else {
            nextNode = fetchNextNodeInPath(nextNode, nextp);
        }

        if (nextNode === undefined) {
            break;
        }
    }

    if (nextNode === undefined) {
        var err = new Error("can not find the node");
        callback.error(err);
    } else {
        var preFullKcPath = "";
        if (nextNode['prepath']) {
            var opaths = kcpath.split("#");
            if (opaths.length>0) {
                opaths.splice(-1,1);
            }
            opaths.push(nextNode['prepath']);
            var preFullKcPath = opaths.join('#');
        }
        callback.success(content, nextNode['target'], preFullKcPath);
    }
}
