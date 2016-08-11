/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 10:47:22
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-18 19:19:23
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    var style_key_map = {
        'boldStyle': {"font-weight":"bold"},
        'italicStyle': {"font-style":"italic"},
        'underlineStyle': {"text-decoration":"underline"},
        'crosslineStyle': {"text-decoration":"line-through"},
        'clearStyle': ""
    };

    var symbolselset = ['#symbolsc','#symbolnum','#symboljap','#symbolgre','#symbolkor','#symbolpy','#symbolshape','#symboldrc','#symbolother'];

    var charSet ={
        'symbolsc':['♔','♕','♖','♚','♛','♜','❄','❅','❆','❖','★','☆','✦','✪','✫','✿','❀','❁','ღ','✔','✘','ㄨ','♂','♀','❧','✍','✎','✑','✄','❂','卍','❦','、','。','·','ˉ','ˇ','¨','〃','々','—','～','‖','…','‘’','“”','〔〕','〈〉','《》','「」','『』','〖〗','【】','±','×','÷','∶','∧','∨','∑','∏','∪','∩','∈','∷','√','⊥','∥','∠','⌒','⊙','∫','∮','≡','≌','≈','∽','∝','≠','≮','≯','≤','≥','∞','∵','∴','♂','♀','°','′','″','℃','＄','¤','￠','￡','‰','§','№','☆','★','○','●','◎','◇','◆','□','■','△','▲','※','→','←','↑','↓','〓','〡','〢','〣','〤','〥','〦','〧','〨','〩','㊣','㎎','㎏','㎜','㎝','㎞','㎡','㏄','㏎','㏑','㏒','㏕','︰','￢','￤','℡','ˊ','ˋ','˙','–','―','‥','‵','℅','℉','↖','↗','↘','↙','∕','∟','∣','≒','≦','≧','⊿','═','║','╒','╓','╔','╕','╖','╗','╘','╙','╚','╛','╜','╝','╞','╟','╠','╡','╢','╣','╤','╥','╦','╧','╨','╩','╪','╫','╬','╭','╮','╯','╰','╱','╲','╳','▁','▂','▃','▄','▅','▆','▇','�','█','▉','▊','▋','▌','▍','▎','▏','▓','▔','▕','▼','▽','◢','◣','◤','◥','⊕','〒','〝','〞'],
        'symbolnum':['⒈','⒉','⒊','⒋','⒌','⒍','⒎','⒏','⒐','⒑','⒒','⒓','⒔','⒕','⒖','⒗','⒘','⒙','⒚','⒛','⑴','⑵','⑶','⑷','⑸','⑹','⑺','⑻','⑼','⑽','⑾','⑿','⒀','⒁','⒂','⒃','⒄','⒅','⒆','⒇','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','㈠','㈡','㈢','㈣','㈤','㈥','㈦','㈧','㈨','㈩','ⅰ','ⅱ','ⅲ','ⅳ','ⅴ','ⅵ','ⅶ','ⅷ','ⅸ','ⅹ','Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ'],
        'symboljap':['ぁ','あ','ぃ','い','ぅ','う','ぇ','え','ぉ','お','か','が','き','ぎ','く','ぐ','け','げ','こ','ご','さ','ざ','し','じ','す','ず','せ','ぜ','そ','ぞ','た','だ','ち','ぢ','っ','つ','づ','て','で','と','ど','な','に','ぬ','ね','の','は','ば','ぱ','ひ','び','ぴ','ふ','ぶ','ぷ','へ','べ','ぺ','ほ','ぼ','ぽ','ま','み','む','め','も','ゃ','や','ゅ','ゆ','ょ','よ','ら','り','る','れ','ろ','ゎ','わ','ゐ','ゑ','を','ん','ァ','ア','ィ','イ','ゥ','ウ','ェ','エ','ォ','オ','カ','ガ','キ','ギ','ク','グ','ケ','ゲ','コ','ゴ','サ','ザ','シ','ジ','ス','ズ','セ','ゼ','ソ','ゾ','タ','ダ','チ','ヂ','ッ','ツ','ヅ','テ','デ','ト','ド','ナ','ニ','ヌ','ネ','ノ','ハ','バ','パ','ヒ','ビ','ピ','フ','ブ','プ','ヘ','ベ','ペ','ホ','ボ','ポ','マ','ミ','ム','メ','モ','ャ','ヤ','ュ','ユ','ョ','ヨ','ラ','リ','ル','レ','ロ','ヮ','ワ','ヰ','ヱ','ヲ','ン','ヴ','ヵ','ヶ'],
        'symbolgre':['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω','α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω','А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я','а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я'],
        'symbolkor':['ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄸ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅃ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅥ','ㅦ','ㅧ','ㅨ','ㅩ','ㅪ','ㅫ','ㅬ','ㅭ','ㅮ','ㅯ','ㅰ','ㅱ','ㅲ','ㅳ','ㅴ','ㅵ','ㅶ','ㅷ','ㅸ','ㅹ','ㅺ','ㅻ','ㅼ','ㅽ','ㅾ','ㅿ','ㆀ','ㆁ','ㆂ','ㆃ','ㆄ','ㆅ','ㆆ','ㆇ','ㆈ','ㆉ','ㆊ'],
        'symbolpy':['ā','á','ǎ','à','ē','é','ě','è','ī','í','ǐ','ì','ō','ó','ǒ','ò','ū','ú','ǔ','ù','ǖ','ǘ','ǚ','ǜ','ü','i:','i','e','æ','ʌ','ə:','ə','u:','u','ɔ:','ɔ','a:','ei','ai','ɔi','əu','au','iə','εə','uə','p','t','k','b','d','g','f','s','ʃ','θ','h','v','z','ʒ','ð','tʃ','tr','ts','dʒ','dr','dz','m','n','ŋ','l','r','w','j'],
        'symbolshape':['❏','❐','❑','❒','▏','▐','░','▒','▓','▔','▕','■','□','▢','▣','▤','▥','▦','▧','▨','▩','❖','◆','◇','◈','⊙','●','○','◎','¤','❂','✪','Θ','⊕','◉','◌','◐','◑','⊗','◯','❍','◤','◥','►','▶','◀','◣','◢','▲','▼','△','▽','▷','◁','⊿','∆','∇'],
        'symboldrc':['←','↑','→','↓','↙','↘','↖','↗','➝','⇒','⇔','↔','↕','➫','➬','➩','➪','➭','➮','➯','➱','➜','➡','➥','➦','➧','➨','➷','➸','➻','➼','➽','➸','➹','➳','➤','➟','➲','➢','➣','➞','⇪','➚','➘','➙','➛','➺','♐','➴','➵','➶','↨'],
        'symbolother':['ㄅ','ㄆ','ㄇ','ㄈ','ㄉ','ㄊ','ㄋ','ㄌ','ㄍ','ㄎ','ㄏ','ㄐ','ㄑ','ㄒ','ㄓ','ㄔ','ㄕ','ㄖ','ㄗ','ㄘ','ㄙ','ㄚ','ㄛ','ㄜ','ㄝ','ㄞ','ㄟ','ㄠ','ㄡ','ㄢ','ㄣ','ㄤ','ㄥ','ㄦ','ㄧ','ㄨ']
    }

    return uiMixinTextStyle;

    function uiMixinTextStyle() {
        this.attributes({
            textStyleBox:"#textStyleBox",
            textStyleDom: "",
            boldS:"#boldStyle",
            italicS:"#italicStyle",
            underlineS:"#underlineStyle",
            clearS:"#clearStyle",
            crosslineS:"#crosslineStyle",
            styleBrushS:"#styleBrush",
            symbolS:'#symbolInput',

            symbolsc:'#symbolsc',
            symbolnum:'#symbolnum',
            symboljap:'#symboljap',
            symbolgre:'#symbolgre',
            symbolkor:'#symbolkor',
            symbolpy:'#symbolpy',
            symbolshape:'#symbolshape',
            symboldrc:'#symboldrc',
            symbolother:'#symbolother',

            symbolLoaded:false,

        });

        this.renderTextStyle= function() {
            this.attr.textStyleDom = $(this.getTextStyleHtml());
            this.attachEventToTextStyle();
            this.attr.textStyleDom.appendTo(this.attr.propertyPanelDom);
            this.initTextStyleAttach();
        };

        this.applyStyle = function(e, data) {
            console.log('applying style ');
            var updateStyle = style_key_map[e.currentTarget.id];
            if (util.getGlobalVar(window.kc.ns.k.text_current_selection_start) != util.getGlobalVar(window.kc.ns.k.text_current_selection_end)) {
                var textStyleChangeObj = {};
                var crkey = util.getGlobalVar(window.kc.ns.k.text_current_selection_start) + "-" + util.getGlobalVar(window.kc.ns.k.text_current_selection_end);
                textStyleChangeObj[crkey] = updateStyle;

                this.trigger(ns.e.updateNode, {
                    para: {
                        "chtrstyle":textStyleChangeObj
                    },
                    kcpath: this.attr.targetKcPath
                });
            }else{
                if (updateStyle == "") {
                    // this is low, clear keys shall be remembered in server side
                    updateStyle = {"font-weight":"",
                                    "font-style":"",
                                    "text-decoration":"",
                                    "color":"",
                                    "font-family":"",
                                    "margin-bottom":"",
                                    "margin-top":"",
                                    "line-height":""};
                }
                this.trigger(ns.e.updateNode, {
                    para: {
                        style: updateStyle
                    },
                    kcpath: this.attr.targetKcPath
                });
            }
        }

        this.copyStyle = function(){
            this.trigger(ns.e.textCopyStyle,{kcpath: this.attr.targetKcPath});

        };

        this.attachEventToTextStyle = function() {
            var mePropertyDom = this.attr.textStyleDom;
            var me = this;



        };

        this.doChangeSymbol = function(symbolid){
            var thisRef = this;
            $("#"+symbolid).addClass('active');

            $(".picker-items").empty();

            var targetset = charSet[symbolid];
            for (var i in targetset) {
               var targetSymbol = targetset[i];
               var itemElement = $('<div class="symbolitem"><span></span></div>');
               itemElement.find('span').html(targetset[i]);
               itemElement.data('pickerValue', targetset[i]);
               itemElement.on('click', function(e, data){
                   thisRef.trigger(ns.e.textinsertsymbol, {symbol:e.currentTarget.innerText, kcpath: thisRef.attr.targetKcPath});
                   $('#symbolInput').data('picker').hide();
               });
               $('.picker-items').append(itemElement);
           }
        }

        this.changeSymbol = function(e, data){
            for (var i = 0; i < symbolselset.length; i++) {
                $(symbolselset[i]).removeClass('active');
            }
            this.doChangeSymbol(e.currentTarget.id);
        }


        this.applySymbol =function(e,data){
            //console.log(e.currentTarget.innerText);
            this.insertSymbol(e.currentTarget.innerText);
        }

        this.prepareTextStyle=function(){
            var thisRef = this;
            // consider this TODO
            //this.on(this.attr.boldS, "click", this.applyStyle);

            if(!this.attr.symbolLoaded){
                $('#symbolInput').picker({
                    title: '',
                    items: [],
                    selectedCustomClass: 'label label-success',
                    mustAccept: true,
                    placement: 'bottomLeftCorner',
                    showFooter: false,
                    input: 'img',
                    component: 'img',
                    hideOnSelect: true,
                    searchInFooter: false,
                    templates: {
                        popover: '<div class="picker-popover popover symbolpicker"><div class="arrow"></div>' +
                                '<div class="popover-title textC"></div><div class="popover-content"></div></div>',
                        footer: '',
                        buttons: '<button class="picker-btn picker-btn-cancel btn btn-default btn-sm">Cancel</button>' +
                                ' <button class="picker-btn picker-btn-accept btn btn-primary btn-sm">Accept</button>',
                        search: '<ul class="nav nav-pills symboltab "> \
                                    <li id="symbolsc" class="active"><a>特殊字符</a></li> \
                                    <li id="symbolnum"><a>数学字符</a></li> \
                                    <li id="symboljap"><a>日文字符</a></li> \
                                    <li id="symbolgre"><a>希腊字符</a></li> \
                                    <li id="symbolkor"><a>韩文字符</a></li> \
                                    <li id="symbolpy"><a>拼音与音标</a></li> \
                                    <li id="symbolshape"><a>形状</a></li> \
                                    <li id="symboldrc"><a>方向箭头</a></li> \
                                    <li id="symbolother"><a>其他</a></li> \
                                </ul>',
                        picker: '<div class="picker"><div class="picker-items"></div></div>',
                        pickerItem: '<div class="symbolitem"><i></i></div>',
                    }
                });
                $('#symbolInput').picker().on('pickerShown', function(e){
                    //console.log('pickerSelect' + e.pickerValue);
                    var pickitems = $(".picker-items")[0];
                    if (pickitems.children.length == 0) {
                        thisRef.doChangeSymbol('symbolsc');
                    }
                });

                this.attr.symbolLoaded = true;
            }
        };

        this.getTextStyleHtml = function() {
            return [
                '<div class="borderB1 pt10 pb10 width">',
                '<div id="textStyleBox" class="border5 displayI font0 verMiddle divMiddle ">',
                '<a id="boldStyle" class="displayI borderR2" title="加粗"><img src="images/p1_22_1.png"></a>',
                '<a id="italicStyle" class="displayI borderR2" title="斜体"><img src="images/p1_22_2.png"></a>',
                '<a id="underlineStyle" class="displayI borderR2" title="下划线"><img src="images/p1_22_3.png"></a>',
                '<a id="crosslineStyle" class="displayI borderR2" title="划线"><img src="images/p1_22_6.png"></a>',
                '<a id="styleBrush" class="displayI borderR2" title="样式刷"><img src="images/brush.png"></a>',
                '<a id="symbolInput" class="displayI borderR2" title="特殊字符"><img src="images/symbol.png"></a>',
                '<a id="clearStyle" class="displayI" title="清除样式"><img src="images/p1_22_4.png"></a>',
                '</div>',
                '</div>'
            ].join('\n');
        }

        this.setCopidedState = function(){
            $(this.attr.styleBrushS + ' > img').attr("src", 'images/brush_sel.png');
        }

        this.clearCopidedState = function(){
            $(this.attr.styleBrushS + ' > img').attr("src", 'images/brush.png');
        }

        this.initTextStyleAttach =  function() {
            this.on(document, "click", {
                boldS: this.applyStyle,
                italicS: this.applyStyle,
                underlineS: this.applyStyle,
                clearS: this.applyStyle,
                styleBrushS: this.copyStyle,
                crosslineS: this.applyStyle,
                //symbolS: this.displaySymbolPicker

                symbolsc:this.changeSymbol,
                symbolnum:this.changeSymbol,
                symboljap:this.changeSymbol,
                symbolgre:this.changeSymbol,
                symbolkor:this.changeSymbol,
                symbolpy:this.changeSymbol,
                symbolshape:this.changeSymbol,
                symboldrc:this.changeSymbol,
                symbolother:this.changeSymbol,

            });

            this.on(document, ns.e.textStyleCopided, this.setCopidedState);
            this.on(document, ns.e.textCopyStyleClear, this.clearCopidedState);





        };
    };
});
