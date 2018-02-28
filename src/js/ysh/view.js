var postRenderList = [];

function renderDocument(params) {
	// mode, metadata
	var mode = params[MODE];

	var metadata = params[METADATA];
	if (metadata == null) {
		showMessage("metadata is required");
		return;
	}
	var documentMetadata = metadata[METADATA_CONTAINER][DOCUMENT_METADATA];
	var domainId = documentMetadata[DOMAIN];

	var title = documentMetadata[NAME] + " - VIEW";

	var element = $("<div>");
	element.data(DOMAIN_ID, domainId);
	element.data(TITLE, title);
	element.data(GRID_LIST, []);

	var fieldLogicList = YshMetadata.getFieldLogicList();
	var fieldLineLogicList = YshMetadata.getFieldLineLogicList();

	var documentType = documentMetadata[DOCUMENT_TYPE];

	element.data(MODE, mode);
	element.data(REFERENCE_MAP, {});

	if (mode == null) {
		mode = MODE_VIEW;
	}

	postRenderList = [];

	// the title
	element.append($("<div>").addClass("row").append($("<h2>").text(title)));

	element.append(renderFieldList({
		documentMetadata : documentMetadata,
		fieldLogicList : fieldLogicList,
		mode : mode,
	}));

	if (documentMetadata[LINE_ORDER_LIST] != null && documentMetadata[LINE_ORDER_LIST].length > 0) {
		element.append(renderFieldLineList({
			documentMetadata : documentMetadata,
			fieldLineLogicList : fieldLineLogicList,
			mode : mode,
		}));
	}

	// button
	var buttonDiv = $("<div>").addClass("row form-group");

	if (documentType === DOCUMENT_TYPE_DEFAULT) {
		var buttonId = "";
		var buttonText = null;

		if (mode === MODE_CREATE) {
			buttonId = BUTTON_DOCUMENT_INSERT;
			buttonText = "SAVE";
		} else if (mode === MODE_EDIT) {
			buttonId = BUTTON_DOCUMENT_UPDATE;
			buttonText = "SAVE";
		}

		if (buttonText != null) {
			var button = $("<button>", {
				id : buttonId,
				type : "button",
			}).addClass("btn btn-default").text(buttonText);
			buttonDiv.append(button);
		}
	}

	var buttonClose = $("<button>", {
		id : BUTTON_DOCUMENT_NONE,
		type : "button",
	}).addClass("btn btn-default").text("CLOSE");
	buttonDiv.append(buttonClose);

	element.append(buttonDiv);

	return element;
}

function renderFieldList(params) {
	// documentMetadata
	var documentMetadata = params[DOCUMENT_METADATA]
	var fieldLogicList = params[FIELD_LOGIC_LIST];
	var mode = params[MODE];

	var output = $("<div>");

	var regularFieldList = [];
	var imageFieldList = [];
	for (var i = 0; i < documentMetadata[FIELD_ORDER_LIST].length; i++) {
		var field = documentMetadata[FIELD_MAP][documentMetadata[FIELD_ORDER_LIST][i]];
		if (field[DATA_TYPE] === DATA_TYPE_IMAGE)
			imageFieldList.push(i);
		else
			regularFieldList.push(i);
	}

	output.append(renderFieldSection({
		documentMetadata : documentMetadata,
		fieldLogicList : fieldLogicList,
		fieldList : regularFieldList,
		mode : mode,
	}));

	if (imageFieldList.length > 0)
		output.append(renderFieldSection({
			documentMetadata : documentMetadata,
			fieldLogicList : fieldLogicList,
			fieldList : imageFieldList,
			mode : mode,
		}));

	return output;
}

function renderFieldSection(params) {
	var documentMetadata = params[DOCUMENT_METADATA]
	var fieldLogicList = params[FIELD_LOGIC_LIST];
	var fieldList = params[FIELD_LIST];
	var mode = params[MODE];

	// fieldOrderList
	var p = fieldList.length;
	var r = ~~(p / 2);
	var l = p - r;

	// fieldList
	var fieldSection = $("<div>").addClass("row form-horizontal");

	// fieldLeft
	var section = [ l, r ];
	var sectionIndex = 0;

	for (var k = 0; k < section.length; k++) {
		var outputSection = $("<div>").addClass("col-lg-6 col-md-6 col-sm-6 col-xs-12");
		for (var i = 0; i < section[k]; i++) {
			var fieldId = documentMetadata[FIELD_ORDER_LIST][fieldList[i + sectionIndex]];
			outputSection.append(renderField({
				documentMetadata : documentMetadata,
				fieldId : fieldId,
				fieldLogic : fieldLogicList[fieldId],
				mode : mode,
			}));
		}
		sectionIndex += section[k];

		fieldSection.append(outputSection);
	}

	return fieldSection;
}

function renderField(params) {
	// mode, documentMetadata, key
	var documentMetadata = params[DOCUMENT_METADATA];
	var fieldId = params[FIELD_ID];
	var fieldLogic = params[FIELD_LOGIC];
	var mode = params[MODE];

	var domainId = documentMetadata[DOMAIN];
	var fieldMap = documentMetadata[FIELD_MAP];
	var dataType = fieldMap[fieldId][DATA_TYPE];
	var listenerClass = getListenerClass(dataType);

	var required = false;
	var locked = false;
	if (fieldLogic != null) {
		required = fieldLogic[REQUIRED];
		locked = fieldLogic[mode === MODE_CREATE ? LOCKED_ON_INSERT : LOCKED_ON_UPDATE];
	}

	var field = fieldMap[fieldId];

	var domainReference = null;
	if (field[DOMAIN_REFERENCE] != null) {
		domainReference = field[DOMAIN_REFERENCE];
	}

	var output = $("<div>").addClass("row form-group");
	var label = $("<div>").addClass("col-lg-4 col-md-4 col-sm-5 col-xs-12 control-label").text(field[NAME]);
	var value = $("<div>").addClass("col-lg-8 col-md-8 col-sm-7 col-xs-12");

	if (mode === MODE_VIEW) {
		locked = true;
	}

	if (fieldId === FIELD_UNIQUE_ID && mode === MODE_EDIT) {
		required = true;
		locked = true;
	}

	var input = {
		id : PREFIX_FIELD + fieldId,
		domainId : domainId,
		fieldId : fieldId,
		lineId : "",
		dataType : dataType,
		required : required,
		locked : locked,
		domainReference : domainReference,
		listenerClass : listenerClass,
	};

	var element = locked ? renderView(field, input) : renderInput(field, input);
	element.data(input);

	value.append(element);
	output.append(label).append(value);

	return output;
}

function renderFieldLineList(params) {
	var documentMetadata = params[DOCUMENT_METADATA];
	var fieldLineLogicList = params[FIELD_LINE_LOGIC_LIST];
	var mode = params[MODE];

	var fieldLineMap = documentMetadata[FIELD_LINE_MAP];
	var fieldLineOrderList = documentMetadata[FIELD_LINE_ORDER_LIST];

	var domainId = DocumentContent.getDomainId();

	var output = $("<div>");
	for (var i = 0; i < documentMetadata[LINE_ORDER_LIST].length; i++) {
		var lineId = documentMetadata[LINE_ORDER_LIST][i];

		var creatable = YshMetadata.isCreatable(domainId, lineId);

		// line header
		$("<div>").addClass("row").appendTo(output).append($("<h3>").text(documentMetadata[LINE_ORDER_MAP][lineId]));

		// table
		var tableHead = $("<table>");
		var tableBody = $("<table>");

		createScrollableTable({
			PARENT : output,
			TABLE_HEAD : tableHead,
			TABLE_BODY : tableBody,
			LIST_TYPE : VIEW,
		});

		var fieldLogicList = fieldLineLogicList[lineId];

		var thead = $("<thead>").appendTo(tableHead);
		var theadRow = $("<tr>").appendTo(thead);

		if (!(mode === MODE_VIEW) && creatable) {
			theadRow.append($("<th>").css({
				"text-align" : "center",
			}).text("#").addClass("button_1"));
		}

		for (var j = 0; j < fieldLineOrderList[lineId].length; j++) {
			var fieldId = fieldLineOrderList[lineId][j];
			var fieldLine = fieldLineMap[lineId][fieldId];
			var dataType = fieldLine[DATA_TYPE];

			if (fieldId === FIELD_UNIQUE_LINE_ID)
				continue;

			theadRow.append($("<th>").addClass(dataType).text(fieldLine[NAME]));
		}
		var tbody = $("<tbody>", {
			id : PREFIX_LINE + lineId,
		}).appendTo(tableBody).data({
			index : 0,
		});

		// NEW LINE
		if (!(mode === MODE_VIEW) && creatable) {
			var tBodyRow = $("<tr>", {
				id : PREFIX_LINE + lineId + SUFFIX_LAST,
			}).appendTo(tbody);

			var button = $("<button>", {
				type : button
			}).addClass("btn btn-default buttonLineNew").data({
				domainId : documentMetadata[DOMAIN],
				lineId : lineId,
			}).append($("<span>").addClass("glyphicon glyphicon-asterisk"));

			tBodyRow.append($("<td>").append(button).addClass("button_1"));

			for (var j = 0; j < fieldLineOrderList[lineId].length; j++) {
				var fieldId = fieldLineOrderList[lineId][j];
				var fieldLine = fieldLineMap[lineId][fieldId];
				var dataType = fieldLine[DATA_TYPE];

				if (fieldId === FIELD_UNIQUE_LINE_ID)
					continue;

				tBodyRow.append($("<td>").addClass(dataType));
			}
		}
	}

	return output;
}