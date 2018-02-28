var YshButton = function() {

	this.align = function() {
		return "left";
	};

	this.convert = function(value) {
		if (value == null)
			return "";

		return value;
	}

	this.format = function(value) {
		return value;
	}

	this.styleCell = function() {
		return {
			"text-align" : "left"
		};
	}

	this.renderInput = function(params) {
		var id = params[ID];
		var domainId = params[DOMAIN_ID];
		var fieldId = params[FIELD_ID];
		var required = params[REQUIRED];

		var text = $("<p>");

		var button = $("<button>") //
		.addClass("btn btn-default yshButton") //
		.append($("<span>").addClass("glyphicon glyphicon-check"));

		var element = $("<div>", {
			id : id,
		});
		element.append(text)
		element.append(button);

		return element;
	}

	this.renderView = function(params) {
		var id = params[ID];
		var fieldId = params[FIELD_ID];

		return $("<input>", {
			id : id,
			type : "text",
			readonly : true,
		}).addClass("form-control").css({
			"text-align" : "left",
		}).css("min-width", MIN_WIDTH_TEXT);
	}
};

YshButton.setValue = function(params) {
	var element = params[ELEMENT];
	var value = params[DATA_VALUE];

	element.data(DATA_VALUE, value);

	if (value === "CLICKED") {
		element.children("p").html("CLICKED");
		element.children("button").css("display", "none");
	} else {
		element.children("p").html("NOT CLICKED");
		element.children("button").css("display", "block");
	}
}

$(document).on(CLICK, ".yshButton", function(event) {
	var parent = $(this).parent();

	YshButton.setValue({
		element : parent,
		value : "CLICKED",
	});
});