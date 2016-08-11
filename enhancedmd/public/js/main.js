/*
 * @Author: Vaninadh
 * @Date:   2016-03-01 10:56:28
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-09 20:20:38
 */

requirejs.config({
    baseUrl: 'js',
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery',
        'bootstrap': '/bower_components/bootstrap/dist/js/bootstrap.min',
        'jquery-ui': '/bower_components/jquery-ui/jquery-ui',
        'mustache': '/bower_components/mustache.js/mustache.min',
        'es5-shim': '/bower_components/es5-shim/es5-shim.min',
        'es5-sham': '/bower_components/es5-shim/es5-sham.min',
        'flight': '/bower_components/flight',
        'jquery-bridget': '/bower_components/jquery-bridget/jquery-bridget',
        'masonry': '/bower_components/masonry/dist/masonry.pkgd',
        'imagesloaded': '/bower_components/imagesloaded/imagesloaded.pkgd.min',
        'grid': '/bower_components/gijgo/dist/combined/js/grid',
        'minicolors': '/bower_components/jquery-minicolors/jquery.minicolors',
        'leancloudav': '/bower_components/leancloud-jssdk.js/dist/av',
        'leancloudavcore': '/bower_components/leancloud-jssdk.js/dist/av-core',
        'propeller': '/js/propeller',
        'noty': '/bower_components/noty/js/noty/packaged/jquery.noty.packaged.min',
        'cookie': '/bower_components/js-cookie/src/js.cookie',
        'picker': '/bower_components/bootstrap-popover-picker/dist/js/bootstrap-picker.min',
        'spectrum': '/bower_components/spectrum/spectrum',
        'spectrumzhcn': '/bower_components/spectrum/i18n/jquery.spectrum-zh-cn'
    },
    shim: {
        'flight/lib/component': {
            deps: ['jquery', 'es5-shim', 'es5-sham']
        },
        'imagesloaded': {
            eps: ['jquery'],
            exports: 'imagesloaded'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'jquery-ui': {
            deps: ['jquery'],
            exports: 'jquery-ui'
        },
        'jquery-bridget': {
            deps: ['jquery'],
            exports: 'jquery-bridget'
        },
        'grid': {
            deps: ['jquery'],
            exports: 'grid'
        },
        'minicolors': {
            deps: ['jquery'],
            exports: 'minicolors'
        },
        'propeller': {
            deps: ['jquery']
        },
        'masonry': {
            deps: ['jquery'],
            exports: 'masonry'
        },
        'noty': {
            deps: ['jquery'],
            exports: 'noty'
        },
        'picker':{
            deps: ['jquery'],
            exports: 'picker'
        },
        'spectrum':{
            deps: ['jquery'],
            exports: 'spectrum'
        },
        'spectrumzhcn':{
            deps: ['jquery', 'spectrum'],
            exports: 'spectrumzhcn'
        }
    }
});

require(['KCEPROD/kce'], function(initialize) {
    initialize();
});
