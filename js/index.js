requirejs.config({
    paths: {
        zepto: "lib/zepto",
        underscore: "lib/lodash",
        backbone: "lib/backbone",
        localstorage: "lib/backbone.localStorage",
        jsrender: "lib/jsrender"
    },
    shim: {
        'zepto': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'jsrender': {
            deps: ['zepto']
        },
        'localstorage': {
            deps: ['backbone']
        },
        'backbone': {
            deps: ['zepto','underscore'],
            exports: 'Backbone'
        }
    }
});

require(['main'], function(main) {
//    console.log(new main.MemoList());
    var top = new main.TopView({ model: new main.MemoList() });
});
