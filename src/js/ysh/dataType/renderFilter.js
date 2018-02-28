var RENDER_FILTER = {
	SHORT_CODE : renderFilterShortCode,
	LONG_CODE : renderFilterLongCode,
	SHORT_STRING : renderFilterShortString,
	LONG_STRING : renderFilterLongString,
	INTEGER : renderFilterNumber,
	LONG : renderFilterNumber,
	DECIMAL : renderFilterNumber,
	DECIMAL_PRECISION : renderFilterNumber,
	DATE : renderFilterDate,
	DATE_TIME : renderFilterDateTime,
	BOOLEAN : renderFilterBoolean,
	TIME : renderFilterTime,
	REFERENCE : renderFilterReference,
	REFERENCE_LIST : renderFilterReferenceList,
	IMAGE : renderFilterImage,
	DOCUMENT : renderFilterDocument,
};

function renderFilterShortString(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];

	var input = $("<input>", {
		id : id,
		type : "text",
	}).addClass("form-control").css({
		"text-align" : "left",
	}).css("min-width", MIN_WIDTH_TEXT);

	var listenerClass = params[LISTENER_CLASS];
	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}

function renderFilterLongString(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var input = $("<textarea>", {
		id : id,
		rows : 3,
	}).addClass("form-control").css({
		"text-align" : "left",
	}).css("min-width", MIN_WIDTH_TEXT);

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}

function renderFilterShortCode(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var input = $("<input>", {
		id : id,
		type : "text",
	}).addClass("form-control code").css({
		"text-align" : "left",
	}).css("min-width", MIN_WIDTH_TEXT);

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}

function renderFilterLongCode(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var input = $("<textarea>", {
		id : id,
		rows : 3,
	}).addClass("form-control code").css({
		"text-align" : "left",
	}).css("min-width", MIN_WIDTH_TEXT);

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}

function renderFilterReference(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var referenceMap = params[REFERENCE_MAP];
	var domainReference = params[DOMAIN_REFERENCE];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	if (referenceMap == undefined)
		referenceMap = {};

	var output = $("<div>") //
	.addClass("input-group select2-bootstrap-append") //
	.css("min-width", MIN_WIDTH_TEXT);

	var select = $("<select>", {
		id : id,
	}).addClass("select2 form-control");

	output.append(select);
	appendButtonReference(output);

	if (required)
		select.addClass(REQUIRED);
	if (!isEmpty(listenerClass))
		select.addClass(listenerClass);

	select.data(DOMAIN_REFERENCE, domainReference);
	transformToSelect2(select);

	return output;
}

function renderFilterReferenceList(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var domainReference = params[DOMAIN_REFERENCE];
	var referenceMap = params[REFERENCE_MAP];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	if (referenceMap == undefined)
		referenceMap = {};

	var output = $("<div>") //
	.addClass("input-group select2-bootstrap-append") //
	.css({
		"min-width" : MIN_WIDTH_TEXT,
	});

	var select = $("<select>", {
		id : id,
		multiple : "multiple",
	}).addClass("select2 form-control");

	output.append(select);
	appendButtonReference(output);

	if (required)
		select.addClass(REQUIRED);
	if (!isEmpty(listenerClass))
		select.addClass(listenerClass);

	select.data(DOMAIN_REFERENCE, domainReference);
	transformToSelect2(select);

	return output;
}

function renderFilterBoolean(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	
	var output = $("<input>", {
		id : id,
		type : "checkbox",
		checked : "checked",
	}).data(INPUT_BOOLEAN_DATA);

	if (required) {
		output.addClass(REQUIRED);
	}

	var div = $("<div>").append(output);
	output.bootstrapSwitch();

	return div;
}

function renderFilterDate(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var elementStartDate = renderFilterDateElement({
		parentInputParams : params,
		suffix : SUFFIX_DATE_START,
	});

	var elementEndDate = renderFilterDateElement({
		parentInputParams : params,
		suffix : SUFFIX_DATE_END,
	});

	var mid = $("<p>").css({
		"text-align" : "center",
	}).text("-");

	var output = $("<div>").addClass("row");
	output.append($("<div>").addClass("col-lg-5").css("padding-right", "0px").append(elementStartDate));
	output.append($("<div>").addClass("col-lg-1").append(mid));
	output.append($("<div>").addClass("col-lg-5").css("padding-left", "0px").append(elementEndDate));

	return output;
}

function renderFilterDateElement(params) {
	params[PARAM_DATE_FORMAT] = DATE_FORMAT;

	return renderFieldDateTime(params);
}

function renderFilterDateTime(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var output = $("<div>").addClass("input-group date");
	var input = $("<input>", {
		id : id,
		type : "text",
	}).addClass("form-control dateTimePicker").css("min-width", MIN_WIDTH_DATE).data({
		"container" : "body"
	});

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	output.append(input) //
	.append($("<span>").addClass("input-group-addon").append($("<span>").addClass("glyphicon glyphicon-remove"))) //
	.append($("<span>").addClass("input-group-addon").append($("<span>").addClass("glyphicon glyphicon-calendar")));

	output.datetimepicker(DATE_TIME_FORMAT);

	return output;
}

function renderFilterTime(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var output = $("<div>").addClass("input-group date");
	var input = $("<input>", {
		id : id,
		type : "text",
	}).addClass("form-control dateTimePicker").css("min-width", MIN_WIDTH_DATE).data({
		"container" : "body",
	});

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required)
		input.addClass(REQUIRED);

	output.append(input) //
	.append($("<span>").addClass("input-group-addon").append($("<span>").addClass("glyphicon glyphicon-remove"))) //
	.append($("<span>").addClass("input-group-addon").append($("<span>").addClass("glyphicon glyphicon-calendar")));

	output.datetimepicker(TIME_FORMAT);

	return output;
}

function renderFilterDocument(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var output = renderFileInput({
		parentInputParams : params,
		dataType : DATA_TYPE_DOCUMENT,
		fileInputParams : FILE_INPUT_DOCUMENT_PARAM,
	});

	return output;
}

function renderFilterImage(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var output = renderFileInput({
		parentInputParams : params,
		dataType : DATA_TYPE_IMAGE,
		fileInputParams : FILE_INPUT_IMAGE_PARAM,
	});

	return output;
}

function renderFilterNumber(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];

	var input = $("<input>", {
		id : id,
		type : "text",
	}).addClass("form-control").css({
		"text-align" : "right",
	}).css("min-width", MIN_WIDTH_NUMBER);

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}