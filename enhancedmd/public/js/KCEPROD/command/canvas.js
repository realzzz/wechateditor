define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("../util/util");

    return defineComponent(text);

    function text() {
        this.attributes({
            targetClass: '.canvas',
            titleInput: '#a-title-input',
            descInput: '#a-desc-input',
            indicatorbar: '#indicatorbar',
            errorspan: '#error_span'
        });

        this.createNewArticle = function(e) {
            var canvas = $(this.attr.targetClass);
            var eventDataObj = {
                el: this.attr.targetClass,
                para: {},
                respEvent: window.kc.ns.e.resp.canvas_create_article
            }

            this.trigger(window.kc.ns.e.createArticle, eventDataObj);
        }

        this.renderArticle = function(e, data) {
            var canvas = $(this.attr.targetClass);
            var eventDataObj = {
                aid:'182',
                el: this.attr.targetClass,
                para: {},
                respEvent: window.kc.ns.e.resp.canvas_render_article
            }
            this.trigger(window.kc.ns.e.renderArticle, eventDataObj);
        }

        this.articleCreated = function(e,data){
            this.trigger(window.kc.ns.e.updateAricleUserInfo, data);
        }

        this.articleRendered = function(e){

            this.on(this.attr.titleInput, "input", this.checkInput);
            this.on(this.attr.descInput, "input", this.checkInput);

            this.trigger(window.kc.ns.e.getArticleInfo);
        }

        this.checkInput = function(e)
        {
            console.log("check input fired");
            var title="";
            var desc="";

            console.log(e.currentTarget.id);
            if (e.currentTarget.id == "a-title-input") {
                title = $(this.attr.titleInput)[0].value;
            }
            else if (e.currentTarget.id == "a-desc-input") {
                desc = $(this.attr.descInput)[0].value;
            }
            var attr = {};
            attr['title']=title;
            attr['desc']=desc;
            attr['image']=""; // todo todo todo add image

            this.trigger(window.kc.ns.e.updateArticle, {para:attr})

        }

        this.onNodeChanged = function(e, data){
            var thisRef = this;
            var parentItem = data.parent;
            if (parentItem  == undefined || parentItem.attributes['kctype'].value !== 'container') {
                return;
            }

            if (data.op === window.kc.ns.e.updateNode) {
                if (data.para['style'] === undefined || data.para['style']['height'] === undefined) {
                    return;
                }
            }

            // if (data.op == window.kc.ns.e.updateNode) {
            //     if (data.para == undefined
            //         || data.para.style == undefined
            //         || data.para.style.position == undefined) {
            //             return;
            //     }
            // }


            var maxheight = 0;
            var parentOffsetHeight =0;
            if (parentItem.attributes['root'] == undefined) {
                parentOffsetHeight = $(parentItem).position().top;
            }

            var imgEl = $(parentItem).find('img');
            if (imgEl.length != 0) {
                imgEl.load(function(){
                    thisRef.trigger(window.kc.ns.e.event_node_changed, data);
                    imgEl.unbind('onload');
                })
            }

            // same code written twice, i'm guilty
            for (var i = 0; i < parentItem.children.length; i++) {
                var tmpChild = parentItem.children[i];
                if (tmpChild.className != undefined && tmpChild.className.indexOf("ui-resizable-handle")>-1) {
                    continue;
                }
                var offsetHeight = $(tmpChild).position().top;
                var itemHeight = $(tmpChild).height();
                if (offsetHeight + itemHeight > maxheight) {
                    maxheight = offsetHeight + itemHeight;
                }
            }
            if (maxheight == 0) {
                return;
            }

            maxheight = maxheight - parentOffsetHeight;

            // add padding for new item insert
            // well this depends :
            // a) for those manually added container,  you certainly want the bottom padding since it's eaiser to add more components
            // b) for those existing frame like template, thirdparty, inline-block, auto adding bottom padding is a disaster for their layout
            // the best way is to distinguish a v.s. b case and add padding only for a. Let's leave this as a TODO TODO TODO work. ;-)

            if (parentItem.attributes['root'] != undefined) {
                maxheight = maxheight + 100;
                if(maxheight<800){
                    return;
                }
            }
            // maxheight = maxheight + 50;
            var parentHeight = $(parentItem).css('height');
            if (parentHeight.indexOf('px')> -1) {
                parentHeight = parentHeight.substr(0, parentHeight.length - 2);
                parentHeight = parseInt(parentHeight);
                if(parentHeight >= maxheight)
                {
                    return;
                }
            }
            else{
                return;
            }



            this.trigger(window.kc.ns.e.updateNode, {
                para: {
                    style: {
                        height: maxheight + 'px'
                    }
                },
                // TODO -> is this correct?
                el: parentItem,
                respEvent: window.kc.ns.e.resp.resize_node_update
            });

        }



        this.renderArticleInfo = function(e, data){
            if (data['obj'] != undefined) {
                var title = data['obj']['title'];
                var image = data['obj']['image'];
                var desc = data['obj']['description'];

                $(this.attr.titleInput)[0].value = title;
                $(this.attr.descInput)[0].value = desc;
            }
        }

        this.generalErrorHandler = function(err, data){
            var err_op = data[window.kc.ns.k.error_operation];
            var err_rst = data[window.kc.ns.k.error_result_code];
            var err_msg = data[window.kc.ns.k.error_message];
            var thisRef = this;
            var indMsg = "### Error " + err_op + " Code " + err_rst + " Message " + err_msg;
            // disable due to indicator is impled 
            /*
            $(this.attr.errorspan).html(indMsg);
            $(this.attr.indicatorbar).show();
            $(this.attr.indicatorbar).fadeOut(4000, function(){
                $(thisRef.attr.indicatorbar).hide();
            });
            */
        }

        this.after('initialize', function() {

            // TODO TEST CODE  -> USE CREATE ARTICLE HERE
            //this.on(document, window.kc.ns.e.applicationInitialized, this.createNewArticle);
            //this.on(document, window.kc.ns.e.applicationInitialized, this.renderArticle);
            this.on(document, window.kc.ns.e.resp.canvas_create_article, this.articleCreated);
            this.on(document, window.kc.ns.e.targetArticleChanged, this.articleRendered);
            this.on(window.kc.ns.e.event_node_changed, this.onNodeChanged);
            this.on(document, window.kc.ns.e.resp.get_article_info, this.renderArticleInfo);
            this.on(document, window.kc.ns.e.generalError, this.generalErrorHandler);
        });


    }

});
