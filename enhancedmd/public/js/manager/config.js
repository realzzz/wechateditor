/*
 * @Author: Vaninadh
 * @Date:   2016-05-27 15:38:12
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-06-02 11:54:24
 */

requirejs.config({
    baseUrl: 'js',
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery',
        'jquery-ui': '/bower_components/jquery-ui/jquery-ui',
        'leancloudav': '/bower_components/leancloud-jssdk.js/dist/av',
        'leancloudavcore': '/bower_components/leancloud-jssdk.js/dist/av-core',
        'mustache': '/bower_components/mustache.js/mustache.min',
        'jquery-bridget': '/bower_components/jquery-bridget/jquery-bridget',
        'masonry': '/bower_components/masonry/dist/masonry.pkgd'
    },
    shim: {
        'jquery-bridget': {
            deps: ['jquery'],
            exports: 'jquery-bridget'
        },
        'masonry': {
            deps: ['jquery'],
            exports: 'masonry'
        },
        'jquery-ui': {
            deps: ['jquery'],
            exports: 'jquery-ui'
        }
    }
});