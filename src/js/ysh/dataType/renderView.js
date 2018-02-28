var RENDER_VIEW = {
	SHORT_CODE : renderViewShortCode,
	LONG_CODE : renderViewLongCode,
	SHORT_STRING : renderViewShortString,
	LONG_STRING : renderViewLongString,
	INTEGER : renderViewNumber,
	LONG : renderViewNumber,
	DECIMAL : renderViewNumber,
	DECIMAL_PRECISION : renderViewNumber,
	DATE : renderViewDate,
	BOOLEAN : renderViewBoolean,
	TIME : renderViewTime,
	DATE_TIME : renderViewDateTime,
	REFERENCE : renderViewReference,
	REFERENCE_LIST : renderViewReferenceList,
	IMAGE : renderViewImage,
	DOCUMENT : renderViewDocument,
};

function renderViewShortString(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<input>", {
		id : id,
		type : "text",
		readonly : true,
	}).addClass("form-control").css({
		"text-align" : "left",
	});
}

function renderViewLongString(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<textarea>", {
		id : id,
		rows : 3,
		readonly : true,
	}).addClass("form-control").css({
		"text-align" : "left",
	});
}

function renderViewShortCode(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<input>", {
		id : id,
		type : "text",
		readonly : true,
	}).addClass("form-control code").css({
		"text-align" : "left",
	});
}

function renderViewLongCode(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<textarea>", {
		id : id,
		rows : 3,
		readonly : true,
	}).addClass("form-control code").css({
		"text-align" : "left",
	});
}

function renderViewReference(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];
	var referenceMap = params[REFERENCE_MAP];

	var input = $("<input>", {
		id : id,
		type : "text",
		readonly : true,
	}).addClass("form-control").css({
		"text-align" : "left",
	});

	return input;
}

function renderViewReferenceList(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	var input = $("<div>", {
		id : id,
		align : "left",
		readonly : true,
	});

	return input;
}

function renderViewNumber(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<input>", {
		id : id,
		type : "text",
		readonly : true,
	}).addClass("form-control").css({
		"text-align" : "right",
	});
}

function renderViewBoolean(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	var output = $("<input>", {
		id : id,
		type : "checkbox",
		readonly : true,
	}).data(INPUT_BOOLEAN_DATA);

	var div = $("<div>").append(output);
	output.bootstrapSwitch();

	return div;
}

function renderViewDate(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<input>", {
		id : id,
		type : "text",
		readonly : true,
	}).addClass("form-control").css({
		"text-align" : "left",
	});
}

function renderViewTime(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<input>", {
		id : id,
		type : "text",
		readonly : true,
	}).addClass("form-control").css({
		"text-align" : "left",
	});
}

function renderViewDateTime(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<input>", {
		id : id,
		type : "text",
		readonly : true,
	}).addClass("form-control").css({
		"text-align" : "left",
	});
}

function renderViewDocument(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<a>", {
		id : id,
		value : "download",
		target : "blank",
		href : "",
	}).addClass("fileInput btn btn-success btn-small").text(TEXT_VIEW);
}

function renderViewImage(params) {
	var id = params[ID];
	var fieldId = params[FIELD_ID];

	return $("<img>", {
		id : id,
		src : "",
	}) //
	.css({
		"min-width" : MIN_WIDTH_IMAGE,
		"max-width" : MAX_WIDTH_IMAGE,
	})//
	.addClass("fileInput");
}