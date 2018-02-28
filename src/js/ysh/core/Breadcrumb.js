var Breadcrumb = function() {
};

Breadcrumb.dataList = [];

Breadcrumb.elementList = [];

Breadcrumb.dataCount = 0;

Breadcrumb.push = function(content) {
	var index = Breadcrumb.dataCount;
	Breadcrumb.dataList[index] = content;
	Breadcrumb.dataCount++;

	return index;
}

Breadcrumb.getLastIndex = function() {
	for (var i = Breadcrumb.dataCount - 1; i >= 0; i--) {
		if (Breadcrumb.dataList[i] == null)
			continue;

		return i;
	}
	return -1;
}

Breadcrumb.print = function(index) {
	for (var i = 0; i < Breadcrumb.dataCount; i++) {
		if (Breadcrumb.dataList[i] == null) {
			console.log(i + " NULL");
		} else {
			console.log(i);
			console.log(Breadcrumb.dataList[i].data());
		}
	}
}

Breadcrumb.pop = function(index) {
	Breadcrumb.dataList[index] = null;
}

Breadcrumb.load = function(index) {
	return Breadcrumb.dataList[index];
}

Breadcrumb.render = function(index) {
	var buttonElement = $("<button>").addClass("breadcrumb-load").data(INDEX, index).addClass("btn btn-default").text(Breadcrumb.load(index).data(TITLE));
	var buttonClose = $("<button>").addClass("breadcrumb-close").data(INDEX, index).addClass("btn btn-default").append($("<span>").addClass("glyphicon glyphicon-remove"));

	var buttonGroup = $("<div>").css({
		"padding" : "2",
	}).addClass("btn-group");
	buttonGroup.append(buttonElement);
	buttonGroup.append(buttonClose);

	$("#breadcrumb").append(buttonGroup);

	Breadcrumb.elementList[index] = buttonGroup;
}

Breadcrumb.close = function(index, element) {
	Breadcrumb.pop(index);

	Breadcrumb.elementList[index].remove();
	Breadcrumb.elementList[index] = null;

	var currentIndex = $(ELEMENT_DOCUMENT_CONTENT).data(INDEX);
	if (currentIndex == index) {
		var lastIndex = Breadcrumb.getLastIndex();

		if (lastIndex >= 0) {
			DocumentContent.loadContent(Breadcrumb.load(lastIndex));
		} else {
			DocumentContent.reset();
		}
	}
}