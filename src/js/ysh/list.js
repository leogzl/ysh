function renderList(params) {
	var domainId = params[DOMAIN_ID];

	var metadata = METADATA_LIST[domainId];
	if (metadata == null) {
		showMessage("metadata is required");
		return;
	}

	var documentMetadata = metadata[METADATA_CONTAINER][DOCUMENT_METADATA];
	var compositeMetadata = metadata[METADATA_CONTAINER][COMPOSITE_METADATA_MAP][domainId];
	var fieldList = compositeMetadata[FIELD_LIST];

	var title = documentMetadata[NAME] + " - LIST";

	var element = $("<div>");
	element.data(DOMAIN_ID, domainId);
	element.data(TITLE, title);
	element.data(GRID_LIST, []);

	// title
	element.append($("<div>").addClass("row").append($("<h2>").text(title)));

	// filter
	var filter = renderFilterList({
		fieldList : fieldList,
	});

	$("<div>").addClass("row").append(filter).appendTo(element);

	var domainData = {
		domainId : domainId
	};

	var buttonSearch = $("<button>", {
		id : "compositeQuery",
		type : "button",
	}).addClass("btn btn-default").data(domainData).text("SEARCH");

	var elementParent = $("<div>") //
	.addClass("row") //
	.append(buttonSearch);

	if (YshMetadata.isCreatable(domainId)) {
		var buttonNew = $("<button>", {
			id : "documentCreate",
			type : "button",
		}).addClass("btn btn-default").data(domainData).text("CREATE");
		elementParent.append(buttonNew);
	}

	elementParent.appendTo(element);

	var tableHead = $("<table>");
	var tableBody = $("<table>");

	createScrollableTable({
		PARENT : element,
		TABLE_HEAD : tableHead,
		TABLE_BODY : tableBody,
		LIST_TYPE : LIST,
	});

	var theadRow = $("<tr>").appendTo($("<thead>").appendTo(tableHead));
	$("<th>").text("#").appendTo(theadRow).addClass(YshMetadata.isEditable(domainId) ? "button_3" : "button_2");
	for (var j = 0; j < fieldList.length; j++) {
		if (!fieldList[j][SHOW_ON_SUMMARY]) {
			continue;
		}

		var fieldId = fieldList[j][FIELD];

		var dataType = fieldList[j][DATA_TYPE];
		if (dataType === DATA_TYPE_IMAGE || dataType === DATA_TYPE_DOCUMENT)
			continue;

		$("<th>").addClass(dataType).text(fieldList[j][NAME]).appendTo(theadRow);
	}

	var tbody = $("<tbody>", {
		id : "compositeList"
	}).appendTo(tableBody);

	return element;
}

function renderResultList(params) {
	var elementId = params[ELEMENT_ID];
	var domainId = params[DOMAIN_ID];
	var fieldList = params[FIELD_LIST];
	var documentOutput = params[DOCUMENT_OUTPUT];

	var resultList = documentOutput[RESULT_LIST];
	var tbody = $(elementId);
	tbody.empty();

	var editable = YshMetadata.isEditable(domainId);
	var buttonClass = YshMetadata.isEditable(domainId) ? "button_3" : "button_2";

	for (var k = 0; k < resultList.length; k++) {
		var contentMap = resultList[k]["contentMap"];

		var tr = $("<tr>").addClass("documentRow").appendTo(tbody);

		var editData = {
			domainId : domainId,
			entityId : contentMap[FIELD_UNIQUE_ID],
		};

		// add button for edit and view
		var buttonDiv = $("<div>", {
			role : "group",
		}).addClass("btn-group");

		if (editable)
			$("<button>").addClass("btn btn-default documentEdit").data(editData).prepend($("<span>").addClass("glyphicon glyphicon-pencil")).appendTo(buttonDiv);

		$("<button>").addClass("btn btn-default documentView").data(editData).prepend($("<span>").addClass("glyphicon glyphicon-file")).appendTo(buttonDiv);
		$("<button>").addClass("btn btn-default documentPrint").data(editData).prepend($("<span>").addClass("glyphicon glyphicon-print")).appendTo(buttonDiv);

		var td = $("<td>")//
		.attr({
			"data-title" : "#",
		}).append(buttonDiv).appendTo(tr).addClass(buttonClass);

		for (var j = 0; j < fieldList.length; j++) {
			var field = fieldList[j];

			if (!field[SHOW_ON_SUMMARY]) {
				continue;
			}

			var fieldId = field[FIELD];
			var dataType = field[DATA_TYPE];

			if (dataType === DATA_TYPE_IMAGE || dataType === DATA_TYPE_DOCUMENT)
				continue;

			var content = getFormat(field, contentMap[fieldId]);
			if (content == null || content === "")
				content = "&#160;";

			var td = $("<td>") //
			.addClass(dataType) //
			.attr({
				"data-title" : field[NAME],
			}).append(content).appendTo(tr);
		}
	}
}

function renderFilterList(params) {
	var fieldList = params[FIELD_LIST];
	var searchFieldList = [];

	for (var i = 0; i < fieldList.length; i++) {
		if (!fieldList[i][SHOW_ON_SUMMARY])
			continue;
		if (fieldList[i][DATA_TYPE] === DATA_TYPE_REFERENCE_LIST)
			continue;
		if (fieldList[i][FIELD] === FIELD_UNIQUE_ID || fieldList[i][FIELD] === FIELD_NAME || fieldList[i][DATA_TYPE] === DATA_TYPE_REFERENCE || fieldList[i][DATA_TYPE] === DATA_TYPE_DATE || fieldList[i][DATA_TYPE] === DATA_TYPE_BOOLEAN)
			searchFieldList.push(fieldList[i]);
	}

	// fieldList
	var p = searchFieldList.length;
	var r = ~~(p / 2);
	var l = p - r;

	// fieldList
	var output = $("<div>").addClass("row form-horizontal");

	var section = [ l, r ];
	var sectionIndex = 0;

	for (var k = 0; k < section.length; k++) {
		var outputSection = $("<div>").addClass("col-lg-6 col-md-6 col-sm-6 col-xs-12");
		for (var i = 0; i < section[k]; i++) {
			var key = searchFieldList[i + sectionIndex];
			outputSection.append(renderFilter({
				field : searchFieldList[i + sectionIndex],
			}));
		}
		sectionIndex += section[k];
		output.append(outputSection);
	}

	return output;
}

function renderFilter(params) {
	var field = params[FIELD];

	var dataType = field[DATA_TYPE];

	var domainReference = null;
	if (field[DOMAIN_REFERENCE] != null) {
		domainReference = field[DOMAIN_REFERENCE];
	}

	var output = $("<div>").addClass("row form-group");
	var label = $("<div>").addClass("col-lg-4 col-md-4 col-sm-5 col-xs-12 control-label").text(field[NAME]);
	var value = $("<div>").addClass("col-lg-8 col-md-8 col-sm-7 col-xs-12");

	var fieldId = field[FIELD];
	var input = {
		id : PREFIX_FIELD + fieldId,
		fieldId : fieldId,
		domainReference : domainReference,
		readOnly : false,
	};

	value.append(RENDER_FILTER[dataType](input));
	output.append(label).append(value);

	return output;
}
