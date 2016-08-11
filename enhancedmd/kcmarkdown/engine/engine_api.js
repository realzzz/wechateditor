// APIs for engine to work
var articlemngr = require('./engine_article_manager');
var kcpathmngr = require('./engine_kcpath');
var nodemngr = require('./engine_node_manager');
var opHistorymngr = require('./engine_op_history_manager');
var async = require('async');
var util = require('../../util/util');

module.exports.createArticle = function createArticle(attr, callback) {
    async.waterfall([
            // first load the article
            function(ac_callback) {
                articlemngr.createarticle(attr, {
                    success: function onSuccess(articleid, content) {
                        ac_callback(null, content, articleid);
                    },
                    error: function onError(load_error) {
                        console.log("load article error" + load_error.message);
                        var err = new Error("load article error");
                        ac_callback(err)
                    }
                });
            },
            // render article
            function(content,articleid, ac_callback) {
                nodemngr.render(content["kc"], {
                    success: function onSuccess(renderhtml) {
                        ac_callback(null, renderhtml, articleid);
                    },
                    error: function onError(render_error) {
                        console.log("render article error" + render_error.message);
                        var err = new Error("render article failure");
                        ac_callback(err);
                    }
                });
            }
        ],
        function(error, html, articleid) {
            if (error === null) {
                callback.success(html, articleid);
            } else {
                callback.error(error);
            }
        });
}

module.exports.renderArticle = function getArtical(articleid, callback) {
    async.waterfall([
            // first load the article
            function(ac_callback) {
                articlemngr.loadarticle(articleid, {
                    success: function onSuccess(content) {
                        ac_callback(null, content);
                    },
                    error: function onError(load_error) {
                        console.log("load article error" + load_error.message);
                        var err = new Error("load article error");
                        ac_callback(err)
                    }
                });
            },
            // render article
            function(content, ac_callback) {
                nodemngr.render(content["kc"], {
                    success: function onSuccess(renderhtml) {
                        ac_callback(null, renderhtml);
                    },
                    error: function onError(render_error) {
                        console.log("render article error" + render_error.message);
                        var err = new Error("render article failure");
                        ac_callback(err);
                    }
                });
            }
        ],
        function(error, html) {
            if (error === null) {
                callback.success(html);
            } else {
                callback.error(error);
            }
        });
}

module.exports.pruneArticle = function getArtical(articleid, callback) {
    async.waterfall([
        // first load the article
        function(ac_callback) {
            articlemngr.construct_article({},{
                success: function onSuccess(content) {
                    ac_callback(null, content);
                },
                error: function onError(load_error) {
                    console.log("load article error" + load_error.message);
                    var err = new Error("load article error");
                    ac_callback(err)
                }
            });
        },
        // update article
        function(content, ac_callback) {
            content["articleid"] = articleid;
            opHistorymngr.clearOpHistory(articleid, {
                success:function(){

                },
                error:function(){

                }
            });
            articlemngr.updatearticle(articleid, content, {
                success: function onSuccess(aid) {
                    ac_callback(null, aid,content);
                },
                error: function onError(load_error) {
                    console.log("load article error" + load_error.message);
                    var err = new Error("load article error");
                    ac_callback(err)
                }
            });
        },
        // render article
        function(aid,content, ac_callback) {
            nodemngr.render(content["kc"], {
                success: function onSuccess(renderhtml) {
                    ac_callback(null, aid, renderhtml);
                },
                error: function onError(render_error) {
                    console.log("render article error" + render_error.message);
                    var err = new Error("render article failure");
                    ac_callback(err);
                }
            });
        }
    ],
    function(error, aid, content) {
        if (error === null) {
            callback.success(aid, content);
        } else {
            callback.error(error);
        }
    });
}

module.exports.deleteArticle = function deleteArticle(articleid, callback) {
    articlemngr.deletearticle(articleid, callback);
}

// attrObj is a json object for node's attributes
var insertNodeAfterPath = module.exports.insertNodeAfterPath = function insertNodeAfterPath(articleid, kcpath, nodeType, attrObj, callback) {
    // first load the artical
    async.waterfall([
            function(ac_callback) {
                articlemngr.loadarticle(articleid, {
                    success: function onSuccess(content) {
                        ac_callback(null, content);
                    },
                    error: function onError(load_error) {
                        console.log("load article error" + load_error.message);
                        var err = new Error("load article error");
                        ac_callback(err)
                    }
                });
            },
            // then create the node
            function(content, ac_callback) {
                nodemngr.createNode(nodeType, attrObj, {
                    success: function onSuccess(nodeContent) {
                        ac_callback(null, content, nodeContent);
                    },
                    error: function onError(create_error) {
                        console.log("create_error" + create_error.message);
                        var err = new Error("create node error");
                        ac_callback(err);
                    }
                });
            },
            // insert the nodeContent
            function(content, nodeContent, ac_callback) {
                kcpathmngr.insertNodeAfter(content["kc"], kcpath, nodeContent, {
                    success: function onSuccess(updateBodyContent, nodepath, prefullPath, insertedNode) {
                        // save it to history
                        var opid = content['opid']? content['opid']: -1;
                        opHistorymngr.insertOpHistory(articleid, opid, nodepath, "insert", {'preitem':kcpath}, insertedNode, {
                            success:function(newopid){
                                //content['opid'] = newopid;
                                ac_callback(null, content, insertedNode);
                                return;
                            },
                            error: function(){
                                var err = new Error('record history failure');
                                ac_callback(null, content, insertedNode);
                                return;
                            }
                        });
                        //ac_callback(null, content, insertedNode);
                    },
                    error: function onError(insert_error) {
                        console.log("insert_error" + insert_error.message);
                        var err = new Error("insert node error");
                        ac_callback(err);
                    }
                });
            },
            // update the artical
            function(content, nodeContent, ac_callback) {
                content['opid']= -1;
                articlemngr.updatearticle(articleid, content, {
                    success: function onSuccess(aid) {
                        ac_callback(null, content, nodeContent);
                    },
                    error: function onError(update_error) {
                        console.log("update article error" + update_error.message);
                        var err = new Error("update artile error");
                        ac_callback(err);
                    }
                });
            },
            // render the whole article -- TODO TODO TODO
            function(content, nodeContent, ac_callback) {
                nodemngr.render(nodeContent, {
                    success: function onSuccess(renderhtml) {
                        ac_callback(null, renderhtml);
                    },
                    error: function onError(render_error) {
                        console.log("render article error" + render_error.message);
                        var err = new Error("render article failure");
                        ac_callback(err);
                    }
                });
            }
        ],
        // return rendered html
        function(error, html) {
            if (error === null) {
                callback.success(articleid, kcpath, html);
            } else {
                callback.error(error);
            }
        });
}


var duplicateNode = module.exports.duplicateNode = function duplicateNode(articleid, kcpath, callback) {
    // first load the artical
    async.waterfall([
            function(ac_callback) {
                articlemngr.loadarticle(articleid, {
                    success: function onSuccess(content) {
                        ac_callback(null, content);
                    },
                    error: function onError(load_error) {
                        console.log("load article error" + load_error.message);
                        var err = new Error("load article error");
                        ac_callback(err)
                    }
                });
            },
            // then create the node
            function(content, ac_callback) {
                kcpathmngr.getNodeAtPath(content["kc"], kcpath, {
                    success: function onSuccess(nodeContent) {
                        ac_callback(null, content, nodeContent);
                    },
                    error: function onError(create_error) {
                        console.log("get_node_error" + create_error.message);
                        var err = new Error("get node error");
                        ac_callback(err);
                    }
                });
            },
            // insert the nodeContent
            function(content, nodeContent, ac_callback) {
                var deepCopyOfNode = util.deepCloneObject(nodeContent);
                kcpathmngr.insertNodeAfter(content["kc"], kcpath, deepCopyOfNode, {
                    success: function onSuccess(updateBodyContent, nodepath, prefullPath, insertedNode) {
                        // save it to history
                        var opid = content['opid']? content['opid']: -1;
                        opHistorymngr.insertOpHistory(articleid, opid, nodepath, "insert", {'preitem':kcpath}, insertedNode, {
                            success:function(newopid){
                                //content['opid'] = newopid;
                                ac_callback(null, content, insertedNode);
                                return;
                            },
                            error: function(){
                                var err = new Error('record history failure');
                                ac_callback(null, content, insertedNode);
                                return;
                            }
                        });
                        //ac_callback(null, content, insertedNode);
                    },
                    error: function onError(insert_error) {
                        console.log("insert_error" + insert_error.message);
                        var err = new Error("insert node error");
                        ac_callback(err);
                    }
                });
            },
            // update the artical
            function(content, nodeContent, ac_callback) {
                content['opid']= -1;
                articlemngr.updatearticle(articleid, content, {
                    success: function onSuccess(aid) {
                        ac_callback(null, content, nodeContent);
                    },
                    error: function onError(update_error) {
                        console.log("update article error" + update_error.message);
                        var err = new Error("update artile error");
                        ac_callback(err);
                    }
                });
            },
            // render the whole article -- TODO TODO TODO
            function(content, nodeContent, ac_callback) {
                nodemngr.render(nodeContent, {
                    success: function onSuccess(renderhtml) {
                        ac_callback(null, renderhtml);
                    },
                    error: function onError(render_error) {
                        console.log("render article error" + render_error.message);
                        var err = new Error("render article failure");
                        ac_callback(err);
                    }
                });
            }
        ],
        // return rendered html
        function(error, html) {
            if (error === null) {
                callback.success(articleid, kcpath, html);
            } else {
                callback.error(error);
            }
        });
}

// attrObj is a json object for node's attributes
// this is now ONLY used for the redo/undo work - so DO NOT record history here
var insertExistingNodeAfterPath = module.exports.insertExistingNodeAfterPath = function insertExistingNodeAfterPath(articleid, kcpath, nodeContent, hisOp, recordhis, callback) {
    // first load the artical
    async.waterfall([
            function(ac_callback) {
                articlemngr.loadarticle(articleid, {
                    success: function onSuccess(content) {
                        ac_callback(null, content);
                    },
                    error: function onError(load_error) {
                        console.log("load article error" + load_error.message);
                        var err = new Error("load article error");
                        ac_callback(err)
                    }
                });
            },
            // insert the nodeContent
            function(content, ac_callback) {
                kcpathmngr.insertNodeAfter(content["kc"], kcpath, nodeContent, {
                    success: function onSuccess(updateBodyContent, nodepath, prepath, insertContent) {
                        if (recordhis) {
                            // save it to history
                            var opid = content['opid']? content['opid']: -1;
                            opHistorymngr.insertOpHistory(articleid, opid, nodepath, "insert", {'preitem':kcpath}, insertContent, {
                                success:function(newopid){
                                    //content['opid'] = newopid;
                                    return;
                                },
                                error: function(){
                                    return;
                                }
                            });
                        }
                        ac_callback(null, content, insertContent);
                    },
                    error: function onError(insert_error) {
                        console.log("insert_error" + insert_error.message);
                        var err = new Error("insert node error");
                        ac_callback(err);
                    }
                });
            },
            // update the artical
            function(content, nodeContent, ac_callback) {
                if (recordhis) {
                    content['opid']=-1;
                }
                else{
                    content['opid']=hisOp;
                }
                articlemngr.updatearticle(articleid, content, {
                    success: function onSuccess(aid) {
                        ac_callback(null, content, nodeContent);
                    },
                    error: function onError(update_error) {
                        console.log("update article error" + update_error.message);
                        var err = new Error("update artile error");
                        ac_callback(err);
                    }
                });
            },
            // render the whole article -- TODO TODO TODO
            function(content, nodeContent, ac_callback) {
                nodemngr.render(nodeContent, {
                    success: function onSuccess(renderhtml) {
                        ac_callback(null, renderhtml);
                    },
                    error: function onError(render_error) {
                        console.log("render article error" + render_error.message);
                        var err = new Error("render article failure");
                        ac_callback(err);
                    }
                });
            }
        ],
        // return rendered html
        function(error, html) {
            if (error === null) {
                callback.success(articleid, kcpath, html);
            } else {
                callback.error(error);
            }
        });
}


var modifyNodeAtPath = module.exports.modifyNodeAtPath = function modifyNodeAtPath(articleid, kcpath, attrObj,hisOp, callback) {
    // first load the artical
    async.waterfall([
            function(ac_callback) {
                articlemngr.loadarticle(articleid, {
                    success: function onSuccess(content) {
                        ac_callback(null, content);
                    },
                    error: function onError(load_error) {
                        console.log("load article error" + load_error.message);
                        var err = new Error("load article error");
                        ac_callback(err)
                    }
                });
            },
            // then get the node
            function(content, ac_callback) {
                kcpathmngr.getNodeAtPath(content["kc"], kcpath, {
                    success: function onSuccess(nodeContent) {
                        ac_callback(null, content, nodeContent);
                    },
                    error: function onError(get_error) {
                        console.log("get_error" + get_error.message);
                        var err = new Error("get node error");
                        ac_callback(err);
                    }
                });
            },
            // update the nodeContent
            function(content, nodeContent, ac_callback) {
                var oriAttr = {};
                var opid = content['opid']? content['opid']: -1;
                oriAttr = util.getOriValueOfNodeObject(nodeContent, attrObj);

                nodemngr.updateNode(nodeContent, attrObj, {
                    success: function onSuccess(updateNode) {
                        if (hisOp < -1 ) {
                            opHistorymngr.insertOpHistory(articleid, opid, kcpath, "update", oriAttr, attrObj, {
                                success:function(newopid){
                                    //content['opid'] = newopid;
                                    ac_callback(null, content, updateNode);
                                    return;
                                },
                                error: function(){
                                    var err = new Error('record history failure');
                                    ac_callback(null, content, updateNode);
                                    return;
                                }
                            });
                        }
                        else{
                            ac_callback(null, content, updateNode);
                            return;
                        }

                    },
                    error: function onError(update_error) {
                        console.log("update_error" + update_error.message);
                        var err = new Error("update node error");
                        ac_callback(err);
                    }
                });
            },
            // update the artical
            function(content, nodeContent, ac_callback) {
                if (hisOp < -1) {
                    content['opid'] = -1;
                }
                else{
                    content['opid'] = hisOp;
                }
                articlemngr.updatearticle(articleid, content, {
                    success: function onSuccess(aid) {
                        ac_callback(null, content, nodeContent);
                    },
                    error: function onError(update_error) {
                        console.log("update article error" + update_error.message);
                        var err = new Error("update artile error");
                        ac_callback(err);
                    }
                });
            },
            // render the node
            function(content, nodeContent, ac_callback) {
                nodemngr.render(nodeContent, {
                    success: function onSuccess(renderhtml) {
                        ac_callback(null, renderhtml);
                    },
                    error: function onError(render_error) {
                        console.log("render article error" + render_error.message);
                        var err = new Error("render article failure");
                        ac_callback(err);
                    }
                });
            }
        ],
        // return rendered html
        function(error, html) {
            if (error === null) {
                callback.success(articleid, kcpath, html);
            } else {
                callback.error(error);
            }
        });
}

var deleteNodeAtPath = module.exports.deleteNodeAtPath = function deleteNodeAtPath(articleid, kcpath, hisOp, callback) {
    // first load the artical
    async.waterfall([
            function(ac_callback) {
                articlemngr.loadarticle(articleid, {
                    success: function onSuccess(content) {
                        ac_callback(null, content);
                    },
                    error: function onError(load_error) {
                        console.log("load article error" + load_error.message);
                        var err = new Error("load article error");
                        ac_callback(err)
                    }
                });
            },
            // then delete the node
            function(content, ac_callback) {
                var opid = content['opid']? content['opid']: -1;
                kcpathmngr.deleteNode(content["kc"], kcpath, {
                    success: function onSuccess(updateContent, removeItem, prefullPath) {
                        if (hisOp < -1) {
                            opHistorymngr.insertOpHistory(articleid, opid, kcpath, "delete", removeItem, {'preitem':prefullPath}, {
                                success:function(newopid){
                                    //content['opid'] = newopid;
                                    ac_callback(null, content);
                                    return;
                                },
                                error: function(){
                                    var err = new Error('record history failure');
                                    ac_callback(null, content);
                                    return;
                                }
                            });
                        }
                        else{
                            ac_callback(null, content);
                        }
                    },
                    error: function onError(delete_error) {
                        console.log("delete_error" + delete_error.message);
                        var err = new Error("delete node error");
                        ac_callback(err);
                    }
                });
            },
            // update the artical
            function(content, ac_callback) {
                if (hisOp<-1) {
                    content['opid'] = -1;
                }
                else{
                    content['opid'] = hisOp;
                }

                articlemngr.updatearticle(articleid, content, {
                    success: function onSuccess(aid) {
                        ac_callback(null, content);
                    },
                    error: function onError(update_error) {
                        console.log("update article error" + update_error.message);
                        var err = new Error("update artile error");
                        ac_callback(err);
                    }
                });
            }
        ],
        // return rendered html
        function(error) {
            if (error === null) {
                callback.success(articleid, kcpath);
            } else {
                callback.error(error);
            }
        });
}

module.exports.refreshNodeAtPath = function refreshNodeAtPath(articleid, kcpath, callback) {
    // first load the artical
    async.waterfall([
            function(ac_callback) {
                articlemngr.loadarticle(articleid, {
                    success: function onSuccess(content) {
                        ac_callback(null, content);
                    },
                    error: function onError(load_error) {
                        console.log("load article error" + load_error.message);
                        var err = new Error("load article error");
                        ac_callback(err)
                    }
                });
            },
            // then get the node
            function(content, ac_callback) {
                kcpathmngr.getNodeAtPath(content["kc"], kcpath, {
                    success: function onSuccess(nodeContent) {
                        ac_callback(null, content, nodeContent);
                    },
                    error: function onError(get_error) {
                        console.log("get_error" + get_error.message);
                        var err = new Error("get node error");
                        ac_callback(err);
                    }
                });
            },
            // render the node
            function(content, nodeContent, ac_callback) {
                nodemngr.render(nodeContent, {
                    success: function onSuccess(renderhtml) {
                        ac_callback(null, renderhtml);
                    },
                    error: function onError(render_error) {
                        console.log("render article error" + render_error.message);
                        var err = new Error("render article failure");
                        ac_callback(err);
                    }
                });
            }
        ],
        // return rendered html
        function(error, html) {
            if (error === null) {
                callback.success(articleid, kcpath, html);
            } else {
                callback.error(error);
            }
        });
}

// APIs for step forward & step back
module.exports.stepForward = function stepForward(aid, callback){
    async.waterfall([
        // get article
        function(ac_callback) {
            articlemngr.loadarticle(aid, {
                success: function onSuccess(content) {
                    ac_callback(null, content['opid']);
                },
                error: function onError(load_error) {
                    console.log("load article error" + load_error.message);
                    var err = new Error("load article error");
                    ac_callback(err)
                }
            });
        },
        function(opid, ac_callback){
            if (opid == undefined || opid <= -1) {
                ac_callback(null, -1);
                return;
            }
            else{
                ac_callback(null, opid);
            }
        },
        // first fetch the previous operation out
        function(currentopid, ac_callback){
            opHistorymngr.forwardOpHistory(aid, currentopid, {
                success: function onSuccess(opObj){
                    ac_callback(null, opObj);
                },
                error: function onError(err){
                    ac_callback(err);
                }
            });
        },
        // revert previous step
        function(stepObj, ac_callback){
            var sOpid = stepObj['id'];
            var sOp = "";
            // decide op
            // decide kcpath
            var kcpath = stepObj['kcpath'];
            // decide the attr
            var attrfrom = {};
            if (!util.isEmptyStr(stepObj['from']) ) {
                attrfrom = JSON.parse(stepObj['from']);
            }
            var attrto = {};
            if (!util.isEmptyStr(stepObj['to']) ) {
                attrto = JSON.parse(stepObj['to']);
            }

            switch (stepObj['op']) {
                case "insert":
                    sOp = "insert";
                    var kcpreItemPath = attrfrom['preitem'];
                    insertExistingNodeAfterPath(aid, kcpreItemPath, attrto, sOpid, false, {
                        success: function(a, k, h){
                            ac_callback(null, sOp, kcpath,sOpid);
                        },
                        error: function(err){
                            ac_callback(err, null, null, null);
                        }
                    });
                    break;
                case "delete":
                    sOp = "delete";
                    // find the target object and delete it
                    deleteNodeAtPath(aid, kcpath, sOpid, {
                        success: function(aid, kp){
                            ac_callback(null, sOp, kcpath,sOpid);
                        },
                        error: function(err){
                            ac_callback(err, null, null, null);
                        }
                    });
                    break;
                case "update":
                    sOp = "update";
                    modifyNodeAtPath(aid, kcpath, attrto, sOpid, {
                        success: function(a, k, h){
                            ac_callback(null, sOp, kcpath, sOpid);
                        },
                        error: function(err){
                            ac_callback(err, null, null, null);
                        }
                    });
                    break;
                default:
                    var err = new Error("operation not supported");
                    ac_callback(err);
                    break;
            }
        }
    ],
    function(err, sOp, kcpath, sOpid){
        if (err == null) {
            callback.success(sOp, kcpath, sOpid);
        }
        else{
            callback.error(err);
        }
    });
}

module.exports.stepBack = function stepBack(aid, callback){
    async.waterfall([
        // first fetch the previous operation out
        function(ac_callback) {
            articlemngr.loadarticle(aid, {
                success: function onSuccess(content) {
                    ac_callback(null, content['opid']);
                },
                error: function onError(load_error) {
                    console.log("load article error" + load_error.message);
                    var err = new Error("load article error");
                    ac_callback(err)
                }
            });
        },
        function(opid, ac_callback){
            if (opid == undefined || opid <= -1) {
                ac_callback(null, -1);
                return;
            }
            else{
                ac_callback(null, opid);
            }
        },
        function(currentopid, ac_callback){
            opHistorymngr.popLastOpHistory(aid, currentopid, {
                success: function onSuccess(opObj, opNextObj){
                    ac_callback(null, opObj,opNextObj);
                },
                error: function onError(err){
                    ac_callback(err);
                }
            });
        },
        // revert previous step
        function(stepObj,opNextObj, ac_callback){
            var sOpid = opNextObj['id'];
            var sOp = "";
            // decide op
            // decide kcpath
            var kcpath = stepObj['kcpath'];
            // decide the attr
            var attrfrom = {};
            if (!util.isEmptyStr(stepObj['from']) ) {
                attrfrom = JSON.parse(stepObj['from']);
            }
            var attrto = {};
            if (!util.isEmptyStr(stepObj['to']) ) {
                attrto = JSON.parse(stepObj['to']);
            }

            switch (stepObj['op']) {
                case "insert":
                    sOp = "delete";
                    // find the target object and delete it
                    deleteNodeAtPath(aid, kcpath, sOpid, {
                        success: function(aid, kp){
                            ac_callback(null, sOp, kcpath,sOpid);
                        },
                        error: function(err){
                            ac_callback(err, null, null, null);
                        }
                    });

                    break;
                case "delete":
                    sOp = "insert";
                    var kcpreItemPath = attrto['preitem'];
                    insertExistingNodeAfterPath(aid, kcpreItemPath, attrfrom,sOpid, false, {
                        success: function(a, k, h){
                            ac_callback(null, sOp, kcpath, sOpid);
                        },
                        error: function(err){
                            ac_callback(err, null, null, null);
                        }
                    });
                    break;
                case "update":
                    sOp = "update";
                    modifyNodeAtPath(aid, kcpath, attrfrom, sOpid, {
                        success: function(a, k, h){
                            ac_callback(null, sOp, kcpath, sOpid);
                        },
                        error: function(err){
                            ac_callback(err, null, null, null);
                        }
                    });
                    break;
                default:
                    var err = new Error("operation not supported");
                    ac_callback(err);
                    break;
            }
        }
    ],
    function(err, sOp, kcpath,sOpid ){
        if (err == null) {
            callback.success(sOp, kcpath, sOpid);
        }
        else{
            callback.error(err);
        }
    });
}

// APIs for ext object
module.exports.fetchExtNode = function fetchExtNode(attr, callback){
    async.waterfall([
        function(ac_callback) {
            nodemngr.createNode("ext", attr, {
                success: function onSuccess(jsonObj) {
                    ac_callback(null, jsonObj);
                },
                error: function onError(create_error) {
                    console.log("create ext error" + create_error.message);
                    var err = new Error("create ext error" + create_error.message);
                    ac_callback(err);
                }
            });
        },
        function(jsonObj, ac_callback){
            nodemngr.render(jsonObj, {
                success: function onSuccess(html) {
                    ac_callback(null, html);
                },
                error: function onError(render_error) {
                    console.log("render ext error" + render_error.message);
                    var err = new Error("render ext error" + render_error.message);
                    ac_callback(err);
                }
            });
        }
    ],
    function(error, html){
        if (error == null) {
            callback.success(html);
        }
        else{
            callback.error(error);
        }
    });
}

module.exports.getInlineblock = function getInlineblock(attr, callback){
    async.waterfall([
        function(ac_callback) {
            nodemngr.createNode("inline", attr, {
                success: function onSuccess(jsonObj) {
                    ac_callback(null, jsonObj);
                },
                error: function onError(create_error) {
                    console.log("create inlineblock error" + create_error.message);
                    var err = new Error("create inlineblock error" + create_error.message);
                    ac_callback(err);
                }
            });
        },
        function(jsonObj, ac_callback){
            nodemngr.render(jsonObj, {
                success: function onSuccess(html) {
                    ac_callback(null, html, jsonObj);
                },
                error: function onError(render_error) {
                    console.log("render inlineblock error" + render_error.message);
                    var err = new Error("render inlineblock error" + render_error.message);
                    ac_callback(err);
                }
            });
        }
    ],
    function(error, html, jsonObj){
        if (error == null) {
            callback.success(html, jsonObj);
        }
        else{
            callback.error(error);
        }
    });
}
