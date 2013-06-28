requirejs.config({
	baseUrl : 'js/',
	paths : {
        'zepto': "lib/zepto",
        'underscore': "lib/lodash",
        'backbone': "lib/backbone",
		'backbone-helper' : 'lib/backbone-helper',
        'localstorage': "lib/backbone.localStorage",
        'jsrender': "lib/jsrender",
		'jasmine' : 'jasmine_lib/jasmine-1.2.0/jasmine',
		'jasmine-html' : 'jasmine_lib/jasmine-1.2.0/jasmine-html',
		'sinon' : 'jasmine_lib/sinon-1.5.0',
		'jasmine-sinon' : 'jasmine_lib/jasmine-sinon',
		'jasmine-jquery' : 'jasmine_lib/jasmine-jquery'
	},
	shim : {
		'zepto' : {
			exports : '$'
		},
		'underscore' : {
			exports : '_'
		},
		'backbone' : {
			deps : ['underscore', 'zepto'],
			exports : 'Backbone'
		},
		'jsrender' : {
			deps : ['zepto'],
			exports : '$'
		},
		'jasmine' : {
			exports: 'jasmine'
		},
		'jasmine-html' : {
			deps: ['jasmine'],
			exports: 'jasmine'
		},
		'sinon' : {
			exports: 'sinon'
		},
		'jasmine-sinon' : {
			deps: ['jasmine', 'sinon']
		},
		'backbone-helper' : {
			deps : ['underscore', 'backbone'],
			exports : 'Backbone'
		},
		'jasmine-jquery' : {
			deps: ['jasmine']
		}
	}
});

require([
	'zepto',
	'underscore',
	'backbone',
	'jasmine-html',
	'sinon',
	'jasmine-sinon',
	'jasmine-jquery',
	'backbone-helper',
	'jsrender'
], function(
	$,
	_,
	Backbone,
	jasmine,
	sinon
){
	// init jasmine
	var jasmineEnv = jasmine.getEnv();
	(function() {
		jasmineEnv.updateInterval = 1000;
		var htmlReporter = new jasmine.HtmlReporter();
		jasmineEnv.addReporter(htmlReporter);
		jasmineEnv.specFilter = function(spec) {
			return htmlReporter.specFilter(spec);
		};
	})();
	
	require([
		'main'
	], function(
		main
	){
		describe('メモ帳テストコード', function(){
			beforeEach(function(){
				loadFixtures('../../../index.html');
			});
			describe('main.js', function(){
				it('コンストラクタ確認', function(){
					var memoList = new main.MemoList();
					var top = new main.TopView({ model: new main.MemoList()});
					//メモリスト存在確認
					expect(memoList).toBeDefined();
					//トップビュー存在確認
					expect(top).toBeDefined();
				});
			});
			describe('topviewのメソッド', function(){
				it('addOne', function(){
					//addOneメソッド確認
					var stubs = sinon.stub(main.TopView.prototype,'addOne');
					console.dir(stubs);
					var topview = new main.TopView({ model: new main.MemoList()});
					topview.model.trigger('add');
					expect(stubs).toHaveBeenCalledOnce();
					stubs.restore();
				});
				it('createBtn', function(){
					//createBtnメソッド確認
					var stub2 = sinon.stub(main.TopView.prototype,'createBtn');
					$('#wrapper').on('click', '.btn', stub2);
					$('#wrapper').find('.btn').trigger('click');
					expect(stub2).toHaveBeenCalledOnce();
				});
				it('addAll', function(){
					//addOneメソッド確認
					var stubs = sinon.stub(main.TopView.prototype,'addAll');
					var topview = new main.TopView({ model: new main.MemoList()});
					topview.model.trigger('reset');
					expect(stubs).toHaveBeenCalledOnce();
					stubs.restore();
				});
			});
			describe('listviewのメソッド', function(){
				it('initialize', function(){
					//addOneメソッド確認
					var listview = new main.ListView({ model: new main.MemoList()});
					expect(listview).toBeDefined();
				});
				it('render', function(){
					//addメソッド確認
					var listview = new main.ListView({ model: new main.MemoList()});
					expect(listview.render).toBeDefined();
					var res = listview.render();
					console.log(res);
					expect(listview.render).toBeDefined(res);
					expect(res.$el.hasClass('sticky')).toBeTruthy();
				});
				it('edit', function(){
					//editメソッド確認
					var listview = new main.ListView({model: new main.MemoList()});
					expect(listview.edit).toBeDefined();
				});
			});
			describe('Memoのメソッド', function(){
				it('defaults', function(){
					//addOneメソッド確認
					var memo = new main.Memo();
					expect(memo).toBeDefined();
					new main.Memo();
					console.log($('#wrapper').find('#toplist'));
				});
			});
		});
		// run spec
		jasmineEnv.execute();
	});	
});