define(['underscore','zepto', 'backbone',"localstorage","jsrender"], function(_,$,Backbone) {

// Modelの作成ーーーーーーーーーーーーーーーーーーーーーーーーーー

	var Memo = Backbone.Model.extend({
		//デフォルト値を記述
		defaults: function() {
			return {
				title: 'サンプル',
				order: this.nextOrder(),
				done: false
			};
		},
		nextOrder: function() {
			return (this.length) ? this.last().get('order') + 1 : 1;
		}
	});

	var MemoList = Backbone.Collection.extend({

		//モデルはメモを使用
		model: Memo,

		//todos-backbornという名前空間で、localstorageを使用
		localStorage: new Backbone.LocalStorage("todos-backbone"),
		//データを連番で管理するための関数
		nextOrder: function() {
			return (this.length) ? this.last().get('order') + 1 : 1;
		},
		//orderの順にCollectionが並ぶ
		comparator: 'order'
	});

	//新しくtodoListを生成
	//var Memos = new MemoList;

// １つの付箋のビュー設定ーーーーーーーーーーーーーーーーーーーーーーーーーー

	var ListView = Backbone.View.extend({

	//liタグを使う
	tagName:  'div',

	//このビューで管理するDOMイベントと関数の結びつけ
	events: {
		'dblclick .sticky':'edit',
		'click #deleteBtn':'clear',
		'blur .titleInput': 'close'
	},

	//モデルの更新を検知して、ビューを更新する。
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	//モデルの内容をHTMLに落とし込む関数
	render: function() {
		this.$el.addClass('sticky');
		this.$el.html($.templates("#item-template").render(this.model.toJSON()));
		return this;
	},
	edit: function() {
		this.$el.addClass('editing');
		this.$('input').focus();
	},
	clear:function(){
		this.model.destroy();
	},
	close:function(){
		var value = this.$('input').val();
		if (!value) {
			this.clear();
		} else {
			this.model.save({title: value});
			this.$el.removeClass('editing');
		}
	}

	});

// TOPビュー設定ーーーーーーーーーーーーーーーーーーーーーーーーーー

	//トップレベルのビューを別定義。バックボーンのビューを継承
	var TopView = Backbone.View.extend({

	//要素を定義
	el: $('#top'),

	//AppView上のイベント定義
	events: {
	  'click .btn':  'createBtn'
	},

	//コレクションイベントをlistenToすることで、Viewをrenderする
	initialize: function() {
		this.listenTo(this.model, 'add', this.addOne);
		this.listenTo(this.model, 'reset', this.addAll);
		this.model.fetch();
	},

	//新しいタスクビューを作り、親UIに突っ込む
	addOne: function(memo) {
		var view = new ListView({model: memo});
		this.$("#toplist").append(view.render().el);
	},

	createBtn:function(e){
		console.log(this);
		this.text = this.$("#text").val();
		if (this.text) {
		this.model.create({title: this.text,model:this.model});
		$("#text").val('');
		}
	},

	//collectionの中のmodel分だけaddone関数をする
	addAll: function() {
		this.model.each(this.addOne, this);
	}

	});

	return {
		Memo: Memo,
		MemoList: MemoList,
		ListView: ListView,
		TopView: TopView
	};

});