/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 10:47:22
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-18 19:19:23
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    var align_value_map = {
        'textindent':{'text-indent':'20%'},
        'textAlignLeft': {'text-align':'left'},
        'textAlignCenter': {'text-align':'center'},
        'textAlignRight':  {'text-align':'right'}
    };

    var textlineheight = {
        "txtlh1":"1em",
        "txtlh2":"1.5em",
        "txtlh3":"1.75em",
        "txtlh4":"2em",
        "txtlh5":"3em",
        "txtlh6":"4em",
        "txtlh7":"5em",
    }

    return uiMixinTextAlign;

    function uiMixinTextAlign() {
        this.attributes({
            textAlignBox:"#textAlignBox",
            textAlignDom: "",
            textAlignLeft:"#textAlignLeft",
            textAlignCenter:"#textAlignCenter",
            textAlignRight:"#textAlignRight",
            textindent:"#textindent",
            textindentback:"#textindentback",
            texttp:"#texttp",
            textbp:"#textbp",
            texthl:"#texthl",

            txttp5:"#txttp5",
            txttp10:"#txttp10",
            txttp15:"#txttp15",
            txttp20:"#txttp20",
            txttp25:"#txttp25",

            txtbp5:"#txtbp5",
            txtbp10:"#txtbp10",
            txtbp15:"#txtbp15",
            txtbp20:"#txtbp20",
            txtbp25:"#txtbp25",

            txtlh1:"#txtlh1",
            txtlh2:"#txtlh2",
            txtlh3:"#txtlh3",
            txtlh4:"#txtlh4",
            txtlh5:"#txtlh5",
            txtlh6:"#txtlh6",
            txtlh7:"#txtlh7"

        });

        this.renderTextAlign= function() {
            this.attr.textAlignDom = $(this.getTextAlignHtml());
            this.attachEventToTextStyle();
            this.attr.textAlignDom.appendTo(this.attr.propertyPanelDom);

            this.initTextAlignAttach();
        };

        this.applyAlign = function(e, data) {
            if (e.currentTarget.id === 'textindent' || e.currentTarget.id === 'textindentback' )
            {
                var updateIndent = "";
                var indent = this.attr.targetEl.css('text-indent');
                if (indent == undefined && e.currentTarget.id === 'textindentback'){
                    // do nothging
                    return;
                }

                if (indent == undefined && e.currentTarget.id === 'textindent') {
                    updateIndent = '5%';
                }

                if (indent.indexOf('px')>0){
                    indent = indent.replace('px', '%');
                }

                if (indent == '80%' && e.currentTarget.id === 'textindent'){
                    // do nothing
                    return;
                }
                var numIndentStr = indent.substring(0, indent.indexOf('%'));
                var numIndent = parseInt(numIndentStr);

                if (e.currentTarget.id === 'textindent') {
                    numIndent += 5;
                    if (numIndent > 80) {
                        numIndent = 80;
                    }
                }
                else{
                    numIndent -= 5;
                    if (numIndent < 0) {
                        numIndent = 0;
                    }
                }

                updateIndent  = numIndent.toString() + '%';

                if (!util.isEmptyStr(updateIndent)) {
                    updateStyle = {'text-indent': updateIndent};
                    this.trigger(ns.e.updateNode, {
                        para: {
                            style : updateStyle
                        },
                        kcpath: this.attr.targetKcPath
                    });
                }

            }
            else{
                this.trigger(ns.e.updateNode, {
                    para: {
                        style : align_value_map[e.currentTarget.id]
                    },
                    kcpath: this.attr.targetKcPath
                });
            }
        }

        this.applyTxtTp = function (e, data){
            var paddingstr = e.currentTarget.id.substring(5);
            var padding  = parseInt(paddingstr);

            this.trigger(ns.e.updateNode, {
                para: {
                    style : {"margin-top":padding + 'px'}
                },
                kcpath: this.attr.targetKcPath
            });

        }

        this.applyTxtBp = function (e, data){
            var paddingstr = e.currentTarget.id.substring(5);
            var padding  = parseInt(paddingstr);

            this.trigger(ns.e.updateNode, {
                para: {
                    style : {"margin-bottom":padding + 'px'}
                },
                kcpath: this.attr.targetKcPath
            });
        }

        this.applyTxtHl = function (e, data){
            this.trigger(ns.e.updateNode, {
                para: {
                    style : {"line-height":textlineheight[e.currentTarget.id]}
                },
                kcpath: this.attr.targetKcPath
            });
        }

        this.attachEventToTextAlign = function() {
            var mePropertyDom = this.attr.textStyleDom;
            var me = this;

        };

        this.prepareTextAlign=function(){
            // consider this TODO
            //this.on(this.attr.boldS, "click", this.applyStyle);

        };

        this.showtexttpdropdown = function (){
             $(".dropdown-toggle").dropdown();
        }

        this.getTextAlignHtml = function() {
            return [
                '<div id="textAlignBox" class="pb10 pt10 borderB1 textC">',
                '<div class="font14 colorWhite pl15 pt10 textL">对齐</div> ',
                '<a id="textAlignLeft" class="displayI width7 pt5 pr10" title="左对齐"><img src="images/p1_23_2.png"></a>',
                '<a id="textAlignCenter" class="displayI width7 pt5 pr10" title="居中对齐"><img src="images/p1_23_3.png"></a>',
                '<a id="textAlignRight" class="displayI width7 pt5 pr10" title="右对齐"><img src="images/p1_23_4.png"></a>',
                '<br>',
                '<a id="textindent" class="displayI width8 pt5 pr15" title="增加缩进"><img src="images/p1_23_1.png"></a>',
                '<a id="textindentback" class="displayI width8 pt5 pr15" title="减少缩进"><img src="images/p1_23_r.png"></a>',
                '<div class="btn-group">',
                '<a id="texttp" class="displayI width8 pt5 pr15 dropdown-toggle" title="段前距" data-toggle="dropdown"  ><img src="images/txttp.png"></a>',
                '<ul class="dropdown-menu dropdown-sizepicker" role="menu" aria-labelledby="texttp"> \
                  <li role="presentation"><a role="menuitem" id="txttp5" >5</a></li> \
                  <li role="presentation"><a role="menuitem" id="txttp10" >10</a></li> \
                  <li role="presentation"><a role="menuitem" id="txttp15" >15</a></li> \
                  <li role="presentation"><a role="menuitem" id="txttp20" >20</a></li> \
                  <li role="presentation"><a role="menuitem" id="txttp25" >25</a></li> \
                </ul>',
                '</div>',
                '<div class="btn-group">',
                '<a id="textbp" class="displayI width8 pt5 pr15 dropdown-toggle" title="段后距" data-toggle="dropdown"><img src="images/txtbp.png"></a>',
                '<ul class="dropdown-menu dropdown-sizepicker" role="menu" aria-labelledby="textbp"> \
                    <li role="presentation"><a role="menuitem" id="txtbp5" >5</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtbp10" >10</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtbp15" >15</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtbp20" >20</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtbp25" >25</a></li> \
                </ul>',
                '</div>',
                '<div class="btn-group">',
                '<a id="textlh" class="displayI width8 pt5 pr15 dropdown-toggle" title="行高" data-toggle="dropdown"><img src="images/txtlh.png"></a>',
                '<ul class="dropdown-menu dropdown-sizepicker" role="menu" aria-labelledby="textlh"> \
                    <li role="presentation"><a role="menuitem" id="txtlh1" >1</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtlh2" >1.5</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtlh3" >1.75</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtlh4" >2</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtlh5" >3</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtlh6" >4</a></li> \
                    <li role="presentation"><a role="menuitem" id="txtlh7" >5</a></li> \
                </ul>',
                '</div>',
                '</div>'
            ].join('\n');
        };

        this.initTextAlignAttach =  function() {
            this.on(document, "click", {
                textAlignLeft: this.applyAlign,
                textAlignCenter: this.applyAlign,
                textAlignRight: this.applyAlign,
                textindent: this.applyAlign,
                textindentback: this.applyAlign,
                texttp: this.showtexttpdropdown
            });

            this.on(this.attr.textAlignDom, "click", {
                txttp5: this.applyTxtTp,
                txttp10: this.applyTxtTp,
                txttp15: this.applyTxtTp,
                txttp20: this.applyTxtTp,
                txttp25: this.applyTxtTp,

                txtbp5: this.applyTxtBp,
                txtbp10: this.applyTxtBp,
                txtbp15: this.applyTxtBp,
                txtbp20: this.applyTxtBp,
                txtbp25: this.applyTxtBp,

                txtlh1: this.applyTxtHl,
                txtlh2: this.applyTxtHl,
                txtlh3: this.applyTxtHl,
                txtlh4: this.applyTxtHl,
                txtlh5: this.applyTxtHl,
                txtlh6: this.applyTxtHl,
                txtlh7: this.applyTxtHl,
            });

        };


    };
});
