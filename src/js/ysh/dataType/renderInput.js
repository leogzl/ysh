var RENDER_INPUT = {
	SHORT_CODE : renderInputShortCode,
	LONG_CODE : renderInputLongCode,
	SHORT_STRING : renderInputShortString,
	LONG_STRING : renderInputLongString,
	INTEGER : renderInputNumber,
	LONG : renderInputNumber,
	DECIMAL : renderInputNumber,
	DECIMAL_PRECISION : renderInputNumber,
	DATE : renderInputDate,
	DATE_TIME : renderInputDateTime,
	BOOLEAN : renderInputBoolean,
	TIME : renderInputTime,
	REFERENCE : renderInputReference,
	REFERENCE_LIST : renderInputReferenceList,
	IMAGE : renderInputImage,
	DOCUMENT : renderInputDocument,
};

function renderInputShortString(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];

	var input = $("<input>", {
		id : id,
		type : "text",
	}).addClass("form-control").css({
		"text-align" : "left",
	});

	var listenerClass = params[LISTENER_CLASS];
	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}

function renderInputLongString(params) {
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
	});

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}

function renderInputShortCode(params) {
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
	});

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}

function renderInputLongCode(params) {
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
	});

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}

function renderInputReference(params) {
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

function renderInputReferenceList(params) {
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

function renderInputBoolean(params) {
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

function renderInputDate(params) {
	params[PARAM_DATE_FORMAT] = DATE_FORMAT;

	return renderFieldDateTime(params);
}

function renderInputDateTime(params) {
	params[PARAM_DATE_FORMAT] = DATE_TIME_FORMAT;

	return renderFieldDateTime(params);
}

function renderInputTime(params) {
	params[PARAM_DATE_FORMAT] = TIME_FORMAT;

	return renderFieldDateTime(params);
}

function renderInputDocument(params) {
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

function renderInputImage(params) {
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

	if (APP_MODE === APP_MODE_MOBILE) {
		var button = $("<button>").addClass("btn btn-default btn-block take-picture").text(" Take Picture").prepend($("<span>").addClass("glyphicon glyphicon-camera"));
		output.append(button);
	}

	return output;
}

function renderInputNumber(params) {
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
	});

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required) {
		input.addClass(REQUIRED);
	}

	return input;
}
