var DocumentContent = function() {
};

DocumentContent.getElement = function() {
	return $(ELEMENT_DOCUMENT_CONTENT);
}

DocumentContent.getMode = function() {
	return DocumentContent.getElement().data(MODE);
}

DocumentContent.getDomainId = function() {
	return DocumentContent.getElement().data(DOMAIN_ID);
}

DocumentContent.getReferenceMap = function(domainId) {
	var referenceMap = DocumentContent.getElement().data(REFERENCE_MAP);
	if (referenceMap == null)
		referenceMap = {};
	if (referenceMap[domainId] == null)
		referenceMap[domainId] = {};

	return referenceMap[domainId];
}

DocumentContent.getReferenceValue = function(domainId, entityId) {
	var name = DocumentContent.getReferenceMap(domainId)[entityId];

	return name == null ? "" : name;
}

DocumentContent.saveReferenceMap = function(referenceMap) {
	for ( var domainId in referenceMap) {
		var currenReferenceMap = DocumentContent.getReferenceMap(domainId);
		for ( var key in referenceMap[domainId]) {
			currenReferenceMap[key] = referenceMap[domainId][key];
		}
	}
}

DocumentContent.setDocumentValue = function(documentValue) {
	var domainId = DocumentContent.getDomainId();
	var documentMetadata = YshMetadata.getDocumentMetadata();

	var fieldMap = documentMetadata[FIELD_MAP];
	var fieldLineMap = documentMetadata[FIELD_LINE_MAP];
	var fieldLineOrderList = documentMetadata[FIELD_LINE_ORDER_LIST];

	var contentMap = documentValue[CONTENT_MAP];
	var contentLineMap = documentValue[CONTENT_LINE_MAP];

	// save referenceMap to data
	DocumentContent.saveReferenceMap(documentValue[REFERENCE_MAP]);

	var mode = DocumentContent.getMode();

	if (contentMap != null) {
		for ( var fieldId in fieldMap) {
			var elementId = "#" + PREFIX_FIELD + fieldId;
			var element = $(elementId);
			var dataType = fieldMap[fieldId][DATA_TYPE];
			var content = contentMap[fieldId];
			var field = fieldMap[fieldId];

			setContentValue({
				element : element,
				content : content,
				field : field,
			});
		}
	}

	if (contentLineMap != null) {
		for (var i = 0; i < documentMetadata[LINE_ORDER_LIST].length; i++) {
			var lineId = documentMetadata[LINE_ORDER_LIST][i];

			var contentLineList = contentLineMap[lineId];
			if (contentLineList == null)
				continue;

			for (var j = 0; j < contentLineList.length; j++) {
				var contentLine = contentLineList[j];
				var lineRowId = contentLine[FIELD_UNIQUE_LINE_ID];

				var tbody = $("#" + PREFIX_LINE + lineId);
				var lastElement = $("#" + PREFIX_LINE + lineId + SUFFIX_LAST);

				var index = -1;
				if ($("#" + PREFIX_LINE + lineId + "-" + lineRowId).length == 0) {
					index = tbody.data("index");
					tbody.data("index", index + 1);

					var tr = $("<tr>", {
						id : PREFIX_LINE + lineId + "-" + index,
					});

					contentLine[FIELD_UNIQUE_LINE_ID] = index;

					renderNewLine({
						element : tr,
						lineId : lineId,
						index : index,
					});

					if (lastElement.length > 0)
						tr.insertBefore(lastElement);
					else
						tr.appendTo(tbody);
				} else {
					index = lineRowId;
				}

				for (var k = 0; k < fieldLineOrderList[lineId].length; k++) {
					var fieldId = fieldLineOrderList[lineId][k];
					if (fieldId === FIELD_UNIQUE_LINE_ID)
						continue;

					var field = fieldLineMap[lineId][fieldId];
					var content = contentLineMap[lineId][j][fieldId];

					var elementId = "#" + PREFIX_FIELD + lineId + "-" + index + "-" + fieldId;
					var element = $(elementId);
					if (element.length == 0)
						showMessage("Cannot get element : '" + elementId + "'");

					setContentValue({
						element : element,
						content : content,
						field : field,
					});
				}
			}
		}
	}
}

DocumentContent.getDocumentValue = function() {
	var domainId = DocumentContent.getDomainId();

	var documentMetadata = YshMetadata.getDocumentMetadata();
	var fieldMap = documentMetadata[FIELD_MAP];
	var fieldLineMap = documentMetadata[FIELD_LINE_MAP];

	var contentMap = {};
	for ( var fieldId in fieldMap) {
		var element = $("#" + PREFIX_FIELD + fieldId);
		var field = fieldMap[fieldId];

		var value = getContentValue({
			field : field,
			element : element,
		});
		contentMap[fieldId] = convertTo(field, value);
	}

	var contentLineMap = {};

	if (documentMetadata[LINE_ORDER_LIST] != null) {
		for (var i = 0; i < documentMetadata[LINE_ORDER_LIST].length; i++) {
			var lineId = documentMetadata[LINE_ORDER_LIST][i];

			var contentLineList = [];

			var index = $("#" + PREFIX_LINE + lineId).data("index");

			for (var j = 0; j < index; j++) {
				if ($("#" + PREFIX_LINE + lineId + "-" + j).length == 0) {
					continue;
				}

				var contentLine = {};
				for ( var fieldId in fieldLineMap[lineId]) {
					var element = $("#" + PREFIX_FIELD + lineId + "-" + j + "-" + fieldId);
					var field = fieldLineMap[lineId][fieldId];

					var value = getContentValue({
						field : field,
						element : element,
					});
					contentLine[fieldId] = convertTo(field, value);
				}
				contentLine[FIELD_UNIQUE_LINE_ID] = j;

				contentLineList.push(contentLine);
			}

			contentLineMap[lineId] = contentLineList;
		}
	}

	var documentValue = {
		contentMap : contentMap,
		contentLineMap : contentLineMap,
	};

	return documentValue;
}

DocumentContent.loadPage = function(params) {
	var pageId = params[PAGE_ID];

	restClientPost({
		command : COMMAND_PAGE_BUILD,
		input : {
			pageId : pageId,
		},
		postMethod : function(output) {
			var content = output[PAGE][CONTENT_MAP][CONTENT];
			var element = $("<div>");
			element.html(content);
			element.data(TITLE, output[PAGE][CONTENT_MAP][NAME]);

			DocumentContent.render(element);
		}
	});
}

DocumentContent.loadDocument = function(params) {
	var mode = params[MODE];
	var domainId = params[DOMAIN_ID];
	var uniqueId = params[UNIQUE_ID];

	var command = "";
	if (mode === MODE_CREATE) {
		command = COMMAND_DOCUMENT_CREATE;
	} else if (mode === MODE_VIEW || mode === MODE_EDIT) {
		command = COMMAND_DOCUMENT_LOAD;
	} else {
		showMessage('Invalid mode : "' + mode + '"');
		return;
	}

	restClientPost({
		command : command,
		input : {
			secretKey : METADATA_SECRET_KEY_LIST[domainId],
			uniqueId : uniqueId,
		},
		postMethod : function(output) {
			var documentValue = output[DOCUMENT];

			if (documentValue[CONTENT_MAP][TRANSACTION_STATUS] != null) {
				var transactionStatus = output[DOCUMENT][CONTENT_MAP][TRANSACTION_STATUS];
				if (!(transactionStatus === TRANSACTION_STATUS_CREATED || transactionStatus === TRANSACTION_STATUS_DRAFTING_IN_PROGRESS)) {
					mode = MODE_VIEW;
				}
			}

			var content = renderDocument({
				mode : mode,
				metadata : METADATA_LIST[domainId],
				documentOutput : output,
			});
			DocumentContent.render(content);

			DocumentContent.setDocumentValue(documentValue);

			if (mode === MODE_CREATE || mode === MODE_EDIT) {
				runClientCommand();
			}
		}
	});
}

DocumentContent.saveDocument = function() {
	var mode = DocumentContent.getMode();
	var domainId = DocumentContent.getDomainId();
	var document = DocumentContent.getDocumentValue();

	var restInput = {
		secretKey : METADATA_SECRET_KEY_LIST[domainId],
		document : document,
	};

	var commandUrl = COMMAND_LIST[mode];
	if (commandUrl == null) {
		showMessage("Invalid mode : '" + mode + "'");
		return;
	}

	restClientPost({
		command : commandUrl,
		input : restInput,
		postMethod : function(output) {
			var index = DocumentContent.getElement().data(INDEX);
			Breadcrumb.close(index);
		}
	});
}

DocumentContent.listDocument = function(params) {
	var domainId = params[DOMAIN_ID];

	DocumentContent.render(renderList({
		domainId : domainId,
	}));

	query({
		domainId : domainId,
	});
}

DocumentContent.render = function(content) {
	DocumentContent.loadContent(content);

	var breadcrumbIndex = Breadcrumb.push(content);
	Breadcrumb.render(breadcrumbIndex);

	content.data(INDEX, breadcrumbIndex);
}

DocumentContent.loadContent = function(content) {
	$(ELEMENT_DOCUMENT_CONTENT).detach();

	content.attr(ID, DOCUMENT_CONTENT);
	$(ELEMENT_DOCUMENT_SECTION).append(content);
	
	var gridList = content.data(GRID_LIST);
	for(var i = 0; i < gridList.length; i++) {
		arrangeScrollElement(gridList[i]);
	}

	var title = content.data(TITLE);
	$(ELEMENT_DOMAIN_ID).text(title);
}

DocumentContent.reset = function() {
	$(ELEMENT_DOCUMENT_CONTENT).detach();
	$(ELEMENT_DOMAIN_ID).text("");
}