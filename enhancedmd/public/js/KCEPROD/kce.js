define(function(require) {
    // some jquery plugins init in here .
    var jqueryUI = require('jquery-ui');
    var lcAv = require('leancloudav');
    var lcAvCore = require('leancloudavcore');
    var propeller = require('propeller');
    var minicolors = require('minicolors');
    var masonry = require('masonry');
    var bridget = require('jquery-bridget');
    var bootstrap = require('bootstrap');
    var picker = require('picker');
    var spectrum = require('spectrum');
    var spectrumzhcn = require('spectrumzhcn');
    $.bridget('masonry', masonry);

    // NOTE - make boot always the first one of kc components initialized
    var boot = require('KCEPROD/boot/boot');

    var application = require('KCEPROD/boot/application');

    var headerPanel = require('KCEPROD/boot/header_panel');
    var siderPanel = require('KCEPROD/boot/sider_panel');
    var editPanel = require('KCEPROD/boot/edit_panel');
    var editHeaderPanel = require('KCEPROD/boot/edit_header_panel');
    var propertyPanel = require('KCEPROD/boot/property_panel');

    var namespace = require('KCEPROD/util/namespace');

    var dataArticle = require('KCEPROD/data/data_article');
    var dataNode = require('KCEPROD/data/data_node');
    var dataUser = require('KCEPROD/data/data_user');

    function initialize() {
        console.log('initialize;');

        boot.attachTo(document);

        dataUser.attachTo(document);
        dataArticle.attachTo(document);
        dataNode.attachTo(document);

        headerPanel.attachTo(document);
        siderPanel.attachTo(document);
        editPanel.attachTo(document);
        editHeaderPanel.attachTo(document);
        propertyPanel.attachTo(document);

        // IMPORTANT ATTENTION -- application shall always be last one to be attached
        application.attachTo(document);

        /*$.fn.extend({
            animateCss: function(animationName) {
               // var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                $(this).addClass('animated ' + animationName);//.removeClass('animated ' + animationName);
            }
        });*/
    }

    return initialize;
})
