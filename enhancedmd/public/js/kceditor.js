requirejs.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'jquery-2.2.0.min',
        'jquery-ui': 'jquery-ui',
        'grid': 'grid-0.5.6'
    },
    shim: {
        'flight': {
            deps: ['jquery', 'jquery-ui', 'grid' ,'es5-shim','es5-sham','propeller']
        },
        'jquery-ui':{
            deps: ['jquery'],
            exports: 'jquery-ui'
        },
        'grid':{
            deps: ['jquery'],
            exports: 'grid'
        },
        'propeller':{
            deps:['jquery']
        }
    }
});

require(['KCE/kce'], function(initialize) {
    initialize();
});
