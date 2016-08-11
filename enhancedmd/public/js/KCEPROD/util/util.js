//x = x.replace(/\\"/g, '"');

define(function(require) {
    var util = {
        constructKcPath: function constructKcPath(item) {
            var kcpath = ""

            if (!item) {
                return kcpath;
            }

            while (item && (item.attributes.root === undefined || item.attributes.root.value !== 'true')) {
                if (item.attributes.kctype != undefined) {
                    var secPath = item.attributes.kctype.value;
                    if (item.attributes.id !== undefined) {
                        var secPath = secPath + '.' + item.attributes.id.value;
                    }
                    if (kcpath === "") {
                        kcpath = secPath;
                    } else {
                        kcpath = secPath + '#' + kcpath;
                    }
                }
                item = item.parentElement;
            }
            return kcpath;
        },
        findParentContainer: function findParentContainer(item) {
            if (item["root"] === "true") {
                return item;
            }
            var itemparent = item.parent("[kctype='container']");
            return itemparent[0];
        },
        // this is equal to function construtSelectorByPath in service engine
        kcpathToSelector: function kcpathToSelector(path, appendCanvas) {
            var selectorPath = "";
            if (path.length != 0) {
                var arrOfPath = path.split("#");
                var selectorPath = "";
                for (var i = 0; i < arrOfPath.length; i++) {
                    var levelpath = arrOfPath[i];
                    var arraOfLevelPath = levelpath.split(".");
                    selectorPath = selectorPath + "[kctype=\"" + arraOfLevelPath[0] + "\"]";
                    if (arraOfLevelPath.length == 2) {
                        selectorPath = selectorPath + "[id=\"" + arraOfLevelPath[1] + "\"] ";
                    }
                    if (i + 1 != arrOfPath.length) {
                        selectorPath = selectorPath + "  >"
                    }
                }
            }

            if (appendCanvas != undefined && appendCanvas.length != 0) {
                if (selectorPath.length > 0) {
                    selectorPath = appendCanvas + ' > ' + selectorPath;
                } else {
                    selectorPath = appendCanvas;
                }
            }

            return selectorPath;
        },
        getItemTypeFromKcPath: function getItemTypeFromKcPath(path) {
            if (path.length == 0) {
                return "container";
            } else {
                var arrOfPath = path.split("#");
                var lastItem = arrOfPath[arrOfPath.length - 1];
                var arrOfItem = lastItem.split(".");
                if (lastItem.length == 0) {
                    return "container";
                } else {
                    return arrOfItem[0]
                }
            }
        },
        // note the file here is the file object that a- can be select from file control b- can be fetched from clipboardData
        uploadfile: function uploadfile(file, cb) {
            $.ajax({
                type: "GET",
                url: "/thirdparty/insert",
                data: JSON.stringify({}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(resultobj) {
                    console.log("result  = " + resultobj);

                    var key = resultobj['key'];
                    var token = resultobj['token'];

                    var Qiniu_UploadUrl = "http://up.qiniu.com";
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', Qiniu_UploadUrl, true);
                    var formData, startDate;
                    formData = new FormData();
                    if (key !== null && key !== undefined) formData.append('key', key);
                    formData.append('token', token);
                    formData.append('file', file);
                    xhr.onreadystatechange = function(response) {
                        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                            var blkRet = JSON.parse(xhr.responseText);
                            console && console.log(blkRet);
                            cb.success(blkRet);
                        } else if (xhr.status != 200 && xhr.responseText) {
                            var err = new Error(xhr.responseText);
                            cb.error(err);
                        }
                    };
                    startDate = new Date().getTime();
                    //$("#progressbar").show();
                    xhr.send(formData);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                }
            });
        },

        getGlobalVar: function getGlobalVar(varName){
            return window.kc[varName];
        },

        removeGlobarVar: function removeGlobarVar(varName){
            delete window.kc[varName];
            return;
        },

        setGlobalVar: function setGlobalVar(varname, val){
            window.kc[varname] =val;
        },

        isEmptyStr: function isEmptyStr(str) {
            return (!str || 0 === str.length);
        },

        removeKcAttr: function removeKcAttr(ori_html){
            ori_html = ori_html.replace(/kctype/g, "kt");
            ori_html = ori_html.replace(/contenteditable/g,"content");
            ori_html = ori_html.replace(/kc-dashed/g," ");
            ori_html = ori_html.replace(/kc-editable/," ");
            return ori_html;
        },


        verifyPhoneNumber: function (mobile){
            var regBox = {
                regEmail : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,//邮箱
                regName : /^[a-z0-9_-]{3,16}$/,//用户名
                regMobile : /^0?1[3|4|5|6|7|8][0-9]\d{8}$/,//手机
                regTel : /^0[\d]{2,3}-[\d]{7,8}$/
            };

            return regBox.regMobile.test(mobile);
        },

        displayGrayBg: function() {
            $('#graybg').show();
        },

        hideGrayBg: function (){
            $('#graybg').hide();
        },

        canvas2clipboard: function canvas2clipboard(){
            var tmpEl =  $('.canvas')[0];
            window.getSelection().removeAllRanges();
            // select the newly added node
            var range = document.createRange();
            range.selectNode(tmpEl);
            window.getSelection().addRange(range);
            // copy
            document.execCommand("copy");
        },

        checkStyleHasWidthAuto : function checkStyleHasWidthAuto(styleStr){
            styleStr = styleStr.replace(/ /g,'');
            var styleArray = styleStr.split(';');
            for (var i = 0; i < styleArray.length; i++) {
                var tmpstyle = styleArray[i];
                var tmpstyleArr = tmpstyle.split(':');
                if (tmpstyleArr.length == 2 &&
                    tmpstyleArr[0]==='width' &&
                    tmpstyleArr[1].indexOf('auto')>-1) {
                    return true;
                }
            }
            return false;
        },

        checkStyleHasBorder: function checkStyleHasBorder(styleStr){
            styleStr = styleStr.replace(/ /g,'');
            var styleArray = styleStr.split(';');
            for (var i = 0; i < styleArray.length; i++) {
                var tmpstyle = styleArray[i];
                var tmpstyleArr = tmpstyle.split(':');
                if (tmpstyleArr.length == 2 &&
                    tmpstyleArr[0]==='border-width') {
                    return true;
                }
            }
            return false;
        },

        constructSytleFromString: function constructSytleFromString(styleStr){
            var styleObj = {};
            var styleArray = styleStr.split(';');
            for (var i = 0; i < styleArray.length; i++) {
                var tmpstyle = styleArray[i];
                var tmpstyleArr = tmpstyle.split(':');
                var tmpstyleKey = tmpstyleArr[0].replace(/ /g,'');
                if (tmpstyleArr.length == 2){
                    if (tmpstyleArr[0] !== 'width'
                    && tmpstyleKey !== 'height'
                    && tmpstyleKey !== 'top'
                    && tmpstyleKey !== 'left'
                    && tmpstyleKey !== 'position') {
                        styleObj[tmpstyleArr[0]]=tmpstyleArr[1];
                    }
                }
            }
            return styleObj;
        },

        mergeObjects: function mergeObjects(oriObj, updateObj){
            var keysOfUpdatedObj = Object.keys(updateObj);
            for (var i = 0; i < keysOfUpdatedObj.length; i++) {
                var tmpkey = keysOfUpdatedObj[i];
                oriObj[tmpkey]= updateObj[tmpkey];
            }
        },

        getLastCanvasItemIndex: function getLastCanvasItemIndex(){
            var parent = $(".canvas > [kctype='container']")[0];
            var currentChildren = parent.children;
            var lastidx = -1;
            for (var i = 0; i < currentChildren.length; i++) {
                if (currentChildren[i].attributes['kctype'] != undefined) {
                    lastidx = i;
                }
            }
            return lastidx;
        },

        clearCanvasHelpers: function clearCanvasHelpers(){
            $('.kc-dashed').removeClass('kc-dashed');
            $('.kc-empty').removeClass('kc-empty');
        },

        getDateIdx: function getDateIdx(){
            var date = new Date();
            var month = date.getMonth() + 1;
            return date.getFullYear() + '-' + month + '-' + date.getDate();
        }
    };
    return util;
})
