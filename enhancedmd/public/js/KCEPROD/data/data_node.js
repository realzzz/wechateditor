define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require('../util/util');
    var ns = window.kc.ns;
    return defineComponent(dataNode);

    function dataNode() {
        this.attributes({

        });


        // IMPORTANT NOTE
        // - the item (data.el) here means the container for create NODE
        // - the preitem (data.preel) here means the previous child in the container for inserting point, if exists

        this.dataCreateNode = function dataCreateNode(e, data) {

            // general paras
            var attrObj = {};
            attrObj = data.para;
            var item = $(data.el);
            var itempath = util.constructKcPath(item.context);
            var parentItem = item;
            parentItem = util.findParentContainer(item);
            var responseEvent = data.respEvent;

            // specific for create node
            var preIdx = data.preel;
            var preitem = preIdx == -1 ? item : item[0].children[preIdx];
            var insertpath = itempath;
            if (preitem != item){
                insertpath = util.constructKcPath(preitem)
            }
            else{
                if (insertpath != "") {
                    insertpath = insertpath + "#";
                }
            }

            var itemtype = data.itemtype;
            var thisRef = this;
            var insertEl = undefined;
            this.nodefunc("insertNode", insertpath, itemtype, attrObj, {
                success: function (resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"')
                        insertEl = $(renderHtml);
                        // do the insert operation
                        if (insertpath == "" || insertpath.substr(insertpath.length - 1) === "#") {
                            // this is insert into
                            var targetkcpath = "";
                            if (insertpath.length > 0) {
                                targetkcpath = insertpath.substr(0, insertpath.length - 1);
                            }
                            var targetSelector = util.kcpathToSelector(targetkcpath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                            var targetItem = $(targetSelector).first();
                            if (targetItem != undefined) {
                                targetItem.prepend(insertEl)
                            }

                            thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: targetItem[0], op: window.kc.ns.e.createNode});
                        }
                        else{
                            // this is insert after
                            var targetSelector = util.kcpathToSelector(insertpath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                            var targetItem = $(targetSelector).first();
                            if (targetItem != undefined) {
                                targetItem.after(insertEl)
                            }

                            var parentContainer = util.findParentContainer(targetItem);
                            thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: parentContainer, op: window.kc.ns.e.createNode});
                        }

                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(responseEvent, {el: insertEl});
                        }

                        if (itemtype == "container" || itemtype == "template" || itemtype == "inlineblock") {
                            thisRef.trigger(window.kc.ns.e.command.uiDroppableActivate);
                        }

                        // disable insert success for now
                        // thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                        //     text:'插入成功!'
                        // });

                    }
                    else{
                        var err = new Error("insert container error");
                        // broadcast the error event
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.createNode;
                        errData[window.kc.ns.k.error_message] = "insert container error";
                        //thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                            text:'插入失败!',
                            type:'error'
                        });
                        return;
                    }
                },
                error: function (err){
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.createNode;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);

                    thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                        text:'插入失败!',
                        type:'error'
                    });
                }
            })

        }

        this.dataCloneNode = function dataCloneNode(e, data){
            // general paras

            var item ;
            var itempath = "";
            if (data.el != undefined) {
                item = $(data.el);
                itempath = util.constructKcPath(item[0]);
            }
            else{
                item = $(data.kcpath);
                itempath = util.constructKcPath(item[0]);
            }

            var itemtype = util.getItemTypeFromKcPath(itempath);

            var insertpath = itempath;
            var responseEvent = data.respEvent;

            var thisRef = this;
            var insertEl = undefined;
            this.nodefunc("duplicateNode", insertpath, "", {}, {
                success: function (resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"')
                        insertEl = $(renderHtml);
                        // do the insert operation
                        if (insertpath == "" || insertpath.substr(insertpath.length - 1) === "#") {
                            // this is insert into
                            var targetkcpath = "";
                            if (insertpath.length > 0) {
                                targetkcpath = insertpath.substr(0, insertpath.length - 1);
                            }
                            var targetSelector = util.kcpathToSelector(targetkcpath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                            var targetItem = $(targetSelector).first();
                            if (targetItem != undefined) {
                                targetItem.prepend(insertEl)
                            }

                            thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: targetItem[0], op: window.kc.ns.e.createNode});
                        }
                        else{
                            // this is insert after
                            var targetSelector = util.kcpathToSelector(insertpath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                            var targetItem = $(targetSelector).first();
                            if (targetItem != undefined) {
                                targetItem.after(insertEl)
                            }

                            var parentContainer = util.findParentContainer(targetItem);
                            thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: parentContainer, op: window.kc.ns.e.createNode});
                        }

                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(responseEvent, {el: insertEl});
                        }

                        if (itemtype == "container" || itemtype == "template" || itemtype == "inlineblock") {
                            thisRef.trigger(window.kc.ns.e.command.uiDroppableActivate);
                        }

                        thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                            text:'克隆成功!'
                        });

                    }
                    else{
                        var err = new Error("insert container error");
                        // broadcast the error event
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.createNode;
                        errData[window.kc.ns.k.error_message] = "insert container error";
                        //thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                            text:'克隆失败!',
                            type:'error'
                        });
                        return;
                    }
                },
                error: function (err){
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.createNode;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);

                    thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                        text:'克隆失败!',
                        type:'error'
                    });
                }
            })

        }

        this.insertInlineblock = function (e, data){

            var item = $(data.kcpath);
            var itempath = util.constructKcPath(item.context);
            var parentItem = item;
            parentItem = util.findParentContainer(item);
            var responseEvent = data.respEvent;
            var itemtype = util.getItemTypeFromKcPath(itempath);

            // specific for create node
            var preIdx = data.preel;
            var preitem = preIdx == -1 ? item : item[0].children[preIdx];
            var insertpath = itempath;
            if (preitem != item){
                insertpath = util.constructKcPath(preitem)
            }
            else{
                if (insertpath != "") {
                    insertpath = insertpath + "#";
                }
            }

            var thisRef = this;
            var insertEl = undefined;
            this.nodefunc("insertInlineblock", insertpath, "", {content: data.content}, {
                success: function (resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"')
                        insertEl = $(renderHtml);
                        // do the insert operation
                        if (insertpath == "" || insertpath.substr(insertpath.length - 1) === "#") {
                            // this is insert into
                            var targetkcpath = "";
                            if (insertpath.length > 0) {
                                targetkcpath = insertpath.substr(0, insertpath.length - 1);
                            }
                            var targetSelector = util.kcpathToSelector(targetkcpath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                            var targetItem = $(targetSelector).first();
                            if (targetItem != undefined) {
                                targetItem.prepend(insertEl)
                            }

                            thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: targetItem[0], op: window.kc.ns.e.createNode});
                        }
                        else{
                            // this is insert after
                            var targetSelector = util.kcpathToSelector(insertpath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                            var targetItem = $(targetSelector).first();
                            if (targetItem != undefined) {
                                targetItem.after(insertEl)
                            }

                            var parentContainer = util.findParentContainer(targetItem);
                            thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: parentContainer, op: window.kc.ns.e.createNode});
                        }

                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(responseEvent, {el: insertEl});
                        }

                        if (itemtype == "container" || itemtype == "template" || itemtype == "inlineblock") {
                            thisRef.trigger(window.kc.ns.e.command.uiDroppableActivate);
                        }

                        thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                            text:'插入成功!'
                        });

                    }
                    else{
                        var err = new Error("insert container error");
                        // broadcast the error event
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.createNode;
                        errData[window.kc.ns.k.error_message] = "insert container error";
                        //thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                            text:'插入失败!',
                            type:'error'
                        });
                        return;
                    }
                },
                error: function (err){
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.createNode;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);

                    thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                        text:'插入失败!',
                        type:'error'
                    });
                }
            })
        }

        this.dataUpdateNode = function dataUpdateNode(e, data) {
            // general paras
            var attrObj = {};
            attrObj = data.para;
            var item ;
            var itempath = "";
            if (data.el != undefined) {
                item = $(data.el);
                itempath = util.constructKcPath(item[0]);
            }
            else{
                item = $(data.kcpath);
                itempath = util.constructKcPath(item[0]);
            }

            var itemtype = util.getItemTypeFromKcPath(itempath);
            var parentItem = item;
            parentItem = util.findParentContainer(item);
            var responseEvent = data.respEvent;
            var thisRef = this;

            this.nodefunc("updateNode", itempath, itemtype, attrObj, {
                success: function (resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"');

                        var targetSelector = util.kcpathToSelector(itempath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                        var targetItem = $(targetSelector).first();
                        targetItem.replaceWith(renderHtml);

                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(responseEvent, {el:targetSelector, path:itempath, type:itemtype});
                        }

                        if (itemtype == "container" || itemtype == "template" || itemtype == "inlineblock") {
                            thisRef.trigger(window.kc.ns.e.command.uiDroppableActivate);
                        }

                        thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: parentItem, op: window.kc.ns.e.updateNode, para:attrObj});
                    }
                    else{
                        console.log("update attributes error");
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.updateNode;
                        errData[window.kc.ns.k.error_message] = "update node error";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function(err){
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.updateNode;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                }
            });
        }

        this.dataDeleteNode = function dataDeleteNode(e, data) {
            // general paras
            var attrObj = {};
            attrObj = data.para;
            var itempath = "";
            if (data.el != undefined) {
                item = $(data.el);
                itempath = util.constructKcPath(item[0]);
            }
            else{
                item = $(data.kcpath);
                itempath = util.constructKcPath(item[0]);
            }
            var itemtype = util.getItemTypeFromKcPath(itempath);
            var parentItem = item;
            parentItem = util.findParentContainer(item);
            var responseEvent = data.respEvent;
            var thisRef = this;


            this.nodefunc("deleteNode", itempath, itemtype, attrObj, {
                success: function (resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){
                        var targetSelector = util.kcpathToSelector(itempath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                        var targetItem = $(targetSelector).first();
                        targetItem.remove();
                        if (!util.isEmptyStr(responseEvent)) {
                            thisRef.trigger(responseEvent, {});
                        }

                        thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: parentItem, op: window.kc.ns.e.deleteNode});
                    }
                    else{
                        console.log("update attributes error");
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.deleteNode;
                        errData[window.kc.ns.k.error_message] = "delete node error";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function(err){
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.deleteNode;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                }
            });
        }

        this.nodefunc = function nodefunc(operation, nodepath, nodetype, nodeattrs, cb) {
            var userid = util.getGlobalVar(window.kc.ns.k.current_user_id);
            var articleid = util.getGlobalVar(window.kc.ns.k.current_article_id);
            $.ajax({
                type: "POST",
                url: "/mdop",
                data: JSON.stringify({op: operation, aid: articleid, uid: userid, kcpath: nodepath, type: nodetype, attrs: nodeattrs}),
                contentType: "application/json; charset=utf-8",
                dataType: "html",
                success: function (resultobj) {
                    cb.success(resultobj);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    var err = new Error("http request error" + XMLHttpRequest.status);
                    cb.error(err);
                }
            });
        }

        this.historyOp = function historyOp(historyOp,cb){
            var articleid = util.getGlobalVar(window.kc.ns.k.current_article_id);

            if (util.isEmptyStr(articleid)) {
                var err = new Error("no article loaded");
                cb.error(err);
                return;
            }

            $.ajax({
                type: "POST",
                url: "/mdop",
                data: JSON.stringify({op: historyOp, aid: articleid}),
                contentType: "application/json; charset=utf-8",
                dataType: "html",
                success: function (resultobj) {
                    cb.success(resultobj);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                    var err = new Error("http request error" + XMLHttpRequest.status);
                    cb.error(err);
                }
            });
        }

        this.redo = function(){
            var thisRef = this;
            this.historyOp("redo",{
                success: function(resultStr){
                    var resultObj = JSON.parse(resultStr);
                    var kcpath = resultObj['kcpath'];
                    var op = resultObj['op'];
                    var opid = resultObj['opid'];
                    thisRef.renderNode(kcpath);
                },
                error:function(err){
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.articleRedoOp;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                }
            })
        }

        this.undo = function(){
            var thisRef = this;
            this.historyOp("undo",{
                success: function(resultStr){
                    var resultObj = JSON.parse(resultStr);
                    var kcpath = resultObj['kcpath'];
                    var op = resultObj['op'];
                    var opid = resultObj['opid'];
                    thisRef.renderNode(kcpath);
                },
                error:function(err){
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.articleUndoOp;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                }
            })
        }

        this.renderNode = function(kcpath){
            var parentpath = "";
            if (kcpath != undefined && kcpath != "") {
                var arrayOfpath = kcpath.split('#');
                arrayOfpath.splice(-1,1);
                parentpath =arrayOfpath.join('#');
            }

            this.nodefunc("renderNode", parentpath, "", {}, {
                success: function(resultStr){
                    var resultObj = JSON.parse(resultStr);
                    if(resultObj["result"] === "0"){

                        var renderHtml = resultObj["content"];
                        renderHtml = renderHtml.replace(/\\"/g, '"');

                        var targetSelector = util.kcpathToSelector(parentpath, window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
                        var targetItem = $(targetSelector).first();
                        targetItem.replaceWith(renderHtml);

                        //if (itemtype == "container" || itemtype == "template" || itemtype == "inlineblock") {
                        thisRef.trigger(window.kc.ns.e.command.uiDroppableActivate);
                        //}

                        //thisRef.trigger(window.kc.ns.e.event_node_changed, {parent: parentItem, op: window.kc.ns.e.updateNode, para:attrObj});
                    }
                    else{
                        console.log("update attributes error");
                        var errData = {};
                        errData[window.kc.ns.k.error_result_code] = 1;
                        errData[window.kc.ns.k.error_operation]= window.kc.ns.e.renderNode;
                        errData[window.kc.ns.k.error_message] = "update node error";
                        thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                        return;
                    }
                },
                error: function(err){
                    var errData = {};
                    errData[window.kc.ns.k.error_result_code] = 1;
                    errData[window.kc.ns.k.error_operation]= window.kc.ns.e.renderNode;
                    errData[window.kc.ns.k.error_message] = err.message;
                    thisRef.trigger(document, window.kc.ns.e.generalError, errData);
                }
            })

        }

        this.after('initialize', function() {
            this.on(document, window.kc.ns.e.createNode, this.dataCreateNode);
            this.on(document, window.kc.ns.e.updateNode, this.dataUpdateNode);
            this.on(document, window.kc.ns.e.deleteNode, this.dataDeleteNode);
            this.on(document, window.kc.ns.e.cloneNode, this.dataCloneNode);

            this.on(document, window.kc.ns.e.articleRedoOp, this.redo);
            this.on(document, window.kc.ns.e.articleUndoOp, this.undo);
            this.on(document, window.kc.ns.e.insertInlineblock ,this.insertInlineblock);
        });
    }
})
