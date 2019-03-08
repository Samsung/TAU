module("profile/wearable/widget/wearable/SwipeList", {});

test("API" , function () {
	var widget;
	equal(typeof tau, 'object', 'Class tau exists');
	equal(typeof tau.widget, 'object', 'Class tau.widget exists');
	equal(typeof tau.widget.wearable, 'object', 'Class tau.widget.wearable exists');
	equal(typeof tau.widget.wearable.SwipeList, 'function', 'Class tau.widget.wearable.SwipeList exists');
	widget = new tau.widget.wearable.SwipeList();

	equal(typeof widget.configure, 'function', 'Method SwipeList.configure exists');
	equal(typeof widget._getCreateOptions, 'function', 'Method SwipeList._getCreateOptions exists');
	equal(typeof widget.build, 'function', 'Method SwipeList.build exists');
	equal(typeof widget.init, 'function', 'Method SwipeList.init exists');
	equal(typeof widget.bindEvents, 'function', 'Method SwipeList.bindEvents exists');
	equal(typeof widget.destroy, 'function', 'Method SwipeList.destroy exists');
	equal(typeof widget.disable, 'function', 'Method SwipeList.disable exists');
	equal(typeof widget.enable, 'function', 'Method SwipeList.enable exists');
	equal(typeof widget.refresh, 'function', 'Method SwipeList.refresh exists');
	equal(typeof widget.option, 'function', 'Method SwipeList.option exists');

});