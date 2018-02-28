function showMessage(message) {
	$("#messageContent").html(message);
	$("#message").modal("show");
}

function restClientPost(params) {
	// command, input, postMethod
	var command = params["command"];
	var input = params["input"];
	var postMethod = params["postMethod"];

	return $.ajax({
		url : SERVER + command,
		type : "POST",
		dataType : "json",
		contentType : "application/json;charset=utf-8",
		data : JSON.stringify(input),
		success : postMethod,
		error : function(data) {
			showMessage(JSON.parse(data["responseText"])["message"]);
		}
	});
}

function restClientGet(params) {
	// command, input, postMethod
	var command = params["command"];
	var input = params["input"];
	var postMethod = params["postMethod"];

	return $.ajax({
		url : SERVER + command,
		type : "GET",
		dataType : "json",
		contentType : "application/json;charset=utf-8",
		data : JSON.stringify(input),
		success : postMethod,
		error : function(data) {
			showMessage(JSON.parse(data["responseText"])["message"]);
		}
	});
}

function transformToSelect2(select) {
	var domainReference = select.data(DOMAIN_REFERENCE);

	select.select2({
		ajax : {
			url : SERVER + COMMAND_DIMENSION_QUERY,
			dataType : "json",
			contentType : "application/json;charset=utf-8",
			type : "POST",
			delay : 600,
			data : function(params) {
				return JSON.stringify({
					secretKey : METADATA_SECRET_KEY_LIST[domainReference],
					simpleFilter : {
						domainId : domainReference,
						value : params["term"],
					}
				});
			},
			processResults : function(data, params) {
				params.page = params.page || 1;

				var referenceMap = DocumentContent.getReferenceMap(domainReference);

				var resultList = [];
				for (var i = 0; i < data[RESULT_LIST].length; i++) {
					resultList.push({
						id : data[RESULT_LIST][i][UNIQUE_ID],
						text : data[RESULT_LIST][i][UNIQUE_ID] + " - " + data[RESULT_LIST][i][NAME],
					});
					referenceMap[data[RESULT_LIST][i][UNIQUE_ID]] = data[RESULT_LIST][i][NAME];
				}

				return {
					results : resultList,
				};
			}
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 0,
		width : "resolve",
	});
}

function renderHome() {
	$("#leftMenuSection").load("./page/leftMenu.html", function() {
		$("#topMenuSection").load("./page/topMenu.html", function() {
			$("#title").text(CLIENT[FIELD_NAME]);
			$("#user").text(CLIENT[FIELD_USER]);

			$("#contentSection").load("./page/content.html", function() {
				var userId = CLIENT[FIELD_USER];
				var clientId = CLIENT[FIELD_CLIENT];

				// load Client User
				restClientPost({
					command : "/rest/page/load",
					input : {
						clientId : clientId,
						userId : userId,
					},
					postMethod : function(output) {
						renderMenu(output);
						renderHomeGentelella();
					}
				});
			});
		});
	});
}

function renderMenu(output) {
	var documentGroupList = output["authorizedDocumentGroupList"];
	var documentMap = output["authorizedDocumentMap"];
	var pageMap = output["authorizedPageMap"];

	console.log(documentGroupList);
	console.log(documentMap);
	console.log(pageMap);

	// [section][group][document]
	var pageList = {};
	for (var i = 0; i < documentGroupList.length; i++) {
		var documentGroup = documentGroupList[i];

		var sectionId = documentGroup["section"][FOREIGN_ID];
		var sectionName = documentGroup["section"][VALUE];

		var group = documentGroup[FIELD_UNIQUE_ID];
		var name = documentGroup[FIELD_NAME];

		if (pageList[sectionId] == null) {
			var menuSection = $("<div>", {
				id : sectionId,
			}).addClass("menu_section");
			menuSection.append($("<h3>").text(sectionName));
			$("#sidebar-menu").append(menuSection);

			pageList[sectionId] = menuSection;

			var elementSection = $("<ul>").addClass("nav side-menu");
			menuSection.append(elementSection);

			pageList[sectionId] = elementSection;
		}

		var elementGroup = $("<ul>").addClass("nav child_menu");

		pageList[sectionId].append($("<li>").append($("<a>", {
			href : "#"
		}).text(name).prepend($("<i>").addClass("fa fa-file-text-o")).append($("<span>").addClass("fa fa-chevron-down"))).append(elementGroup));

		loadDocumentGroup(elementGroup, documentMap[documentGroup[FIELD_UNIQUE_ID]], pageMap[documentGroup[FIELD_UNIQUE_ID]]);
	}
}

function loadDocumentGroup(elementGroup, documentList, pageList) {
	if (documentList != null) {
		for (var i = 0; i < documentList.length; i++) {
			var document = documentList[i]["document"];
			var name = documentList[i][FIELD_NAME];
			var secretKey = documentList[i]["secretKey"];

			var element = $("<li>");
			element.append($("<a>", {
				href : "#",
			}).addClass("menu").data({
				domain : document,
				secretKey : secretKey,
			}).text(name));
			elementGroup.append(element);
		}
	}

	if (pageList != null) {
		for (var i = 0; i < pageList.length; i++) {
			var page = pageList[i]["page"];
			var name = pageList[i][FIELD_NAME];

			var element = $("<li>");
			element.append($("<a>", {
				href : "#",
			}).addClass("menu").data("page", page).text(name));
			elementGroup.append(element);
		}
	}
}

function runClientCommand() {
	var clientCommand = YshMetadata.getClientCommand();
	var clientCommandLineMap = YshMetadata.getClientCommandLineMap();
	var documentMetadata = YshMetadata.getDocumentMetadata();
	var documentValue = DocumentContent.getDocumentValue();

	var mode = DocumentContent.getMode();
	if (!(mode === MODE_EDIT))
		return;

	// save the uniqueId
	var uniqueId = documentValue[CONTENT_MAP][FIELD_UNIQUE_ID];

	for ( var lineId in clientCommandLineMap) {
		var documentLineValue = documentValue[CONTENT_LINE_MAP][lineId];
		for (var i = 0; i < documentLineValue.length; i++) {
			var _ = documentLineValue[i];

			eval(clientCommandLineMap[lineId]);
		}
	}

	var _ = documentValue[CONTENT_MAP];
	eval(clientCommand);

	// restore the uniqueId
	if (mode === MODE_EDIT)
		documentValue[CONTENT_MAP][FIELD_UNIQUE_ID] = uniqueId;

	DocumentContent.setDocumentValue(documentValue);
}

function getElementContainer(element) {
	while (true) {
		fieldId = element.data(FIELD_ID);

		if (isEmpty(fieldId)) {
			element = element.parent();
			continue;
		}

		break;
	}

	return element;
}

function setContentValue(params) {
	var element = params[ELEMENT];
	var content = params[CONTENT];
	var field = params[FIELD];
	var dataType = field[DATA_TYPE];

	if (element.length == 0)
		return;

	var container = getElementContainer(element);

	element.data(DATA_VALUE, content);

	if (dataType === DATA_TYPE_REFERENCE) {
		if (isEmpty(content)) {
			element.val("");
			element.data(UNIQUE_ID, "");
		} else {
			var referenceDomainId = field[DOMAIN_REFERENCE];
			var referenceUniqueId = content;
			var value = "N/A";

			if (container.data(LOCKED)) {
				loadDimensionToTextField({
					element : element,
					domainId : referenceDomainId,
					uniqueId : referenceUniqueId,
				});
			} else {
				loadDimensionToSelect2({
					element : element,
					domainId : referenceDomainId,
					uniqueId : referenceUniqueId,
				});
			}
		}
	} else if (dataType === DATA_TYPE_REFERENCE_LIST) {
		if (!isEmpty(content) && content.length > 0) {
			if (referenceMap != null) {
				var referenceDomainId = field[DOMAIN_REFERENCE];
				var referenceMap = DocumentContent.getReferenceMap(referenceDomainId);

				if (container.data(LOCKED)) {
					element.empty();

					var list = $("<ul>").addClass("reference-list-container");
					for (var i = 0; i < content.length; i++) {
						var referenceValue = referenceMap[referenceDomainId][content[i]];
						if (isEmpty(referenceValue)) {
							referenceValue = "#N/A#";
						}

						var row = $("<li>").addClass("reference-list-row").appendTo(list);
						row.text(content[i] + " - " + referenceValue);

						referenceMap[content[i]] = referenceValue;
					}

					element.append(list);
				} else {
					var selectedContent = [];
					for (var i = 0; i < content.length; i++) {
						var referenceValue = referenceMap[referenceDomainId][content[i]];
						if (isEmpty(referenceValue))
							referenceValue = "#N/A#";

						selectedContent.push(content[i]);
						element.append($("<option>").val(content[i]).text(content[i] + " - " + referenceValue));

						referenceMap[content[i]] = referenceValue;
					}
					element.val(selectedContent).trigger("change");
				}
			}
		} else {
			if (container.data(LOCKED)) {
				element.empty();
			} else {
				element.val("").trigger("change");
			}
		}
	} else if (dataType === DATA_TYPE_BOOLEAN) {
		var readonly = element.bootstrapSwitch("readonly");
		element.bootstrapSwitch("readonly", false);
		element.bootstrapSwitch("state", content);
		element.bootstrapSwitch("readonly", readonly);
	} else if (dataType === DATA_TYPE_IMAGE) {
		if (container.data(LOCKED)) {
			container.attr("src", content);
		} else {
			if (content != null && content.length > 0) {
				setContentImage({
					container : container,
					content : content,
				});
			}
		}
	} else if (dataType === DATA_TYPE_DOCUMENT) {
		if (container.data(LOCKED)) {
			container.attr("href", content);
		} else {
			if (content != null && content.length > 0) {
				if (!container.data("previewUsed")) {
					container.find("form").css("display", "none");
					container.find("div.filePreview").css("display", "block");

					container.find("a.filePreview").attr("href", content);
					container.find("a.fileInput").attr("href", content);

					container.data("previewUsed", true);
				}
			}
		}
	} else if (dataType === DATA_TYPE_COMPONENT) {
		var component = field[COMPONENT];
		var componentFunction = window[component].setValue;

		componentFunction({
			element : element,
			value : content,
		});
	} else {
		var formattedContent = getFormat(field, content);
		element.val(formattedContent);
	}
}

function renderNewLine(params) {
	var rowElement = params[ELEMENT];
	var domainId = DocumentContent.getDomainId();
	var lineId = params[LINE_ID];
	var index = params[INDEX];

	var documentMetadata = YshMetadata.getDocumentMetadata();
	var fieldLineMap = documentMetadata[FIELD_LINE_MAP];
	var fieldLineOrderList = documentMetadata[FIELD_LINE_ORDER_LIST];
	var fieldLogicList = YshMetadata.getFieldLineLogicList()[lineId];

	var mode = DocumentContent.getMode();
	var creatable = YshMetadata.isCreatable(domainId, lineId);
	var editable = YshMetadata.isEditable(domainId, lineId);

	if (!(mode === MODE_VIEW) && creatable) {
		var button = $("<button>") //
		.addClass("btn btn-default buttonLineDelete")//
		.append($("<span>").addClass("glyphicon glyphicon-remove"));

		rowElement.append($("<td>").append(button).addClass("button_1"));
	}

	for (var j = 0; j < fieldLineOrderList[lineId].length; j++) {
		var fieldId = fieldLineOrderList[lineId][j];
		var fieldLine = fieldLineMap[lineId][fieldId];
		var dataType = fieldLine[DATA_TYPE];
		var domainReference = fieldLine[DOMAIN_REFERENCE];
		var listenerClass = getListenerClass(dataType);

		if (fieldId === FIELD_UNIQUE_LINE_ID)
			continue;

		var required = false;
		var locked = false;

		if (fieldLogicList[fieldId] != null) {
			required = fieldLogicList[fieldId][REQUIRED];
			locked = fieldLogicList[fieldId][mode === MODE_CREATE ? LOCKED_ON_INSERT : LOCKED_ON_UPDATE];
		}

		if (mode === MODE_VIEW || !editable)
			locked = true;

		var input = {
			id : PREFIX_FIELD + lineId + "-" + index + "-" + fieldId,
			lineId : lineId,
			index : index,
			fieldId : fieldId,
			dataType : dataType,
			domainReference : domainReference,
			required : required,
			locked : locked,
			listenerClass : listenerClass,
		};

		var element = locked ? renderView(fieldLine, input) : renderInput(fieldLine, input);
		element.data(input);

		var cellElement = $("<td>").attr({
			"data-title" : fieldLine[NAME],
		}).append(element).addClass(dataType);

		rowElement.append(cellElement);
	}
}

function loadDimension(params) {
	var domainId = params[DOMAIN_ID];
	var uniqueId = params[UNIQUE_ID];
	var postMethod = params[POST_METHOD];

	var inputParameter = {
		secretKey : METADATA_SECRET_KEY_LIST[domainId],
		uniqueId : uniqueId,
	};

	restClientPost({
		command : COMMAND_DIMENSION_LOAD,
		input : inputParameter,
		postMethod : postMethod,
	});
}

function loadDimensionToInput(params) {
	var element = params[ELEMENT];
	var domainId = params[DOMAIN_ID];
	var uniqueId = params[UNIQUE_ID];

	loadDimension({
		domainId : domainId,
		uniqueId : uniqueId,
		postMethod : function(output) {
			var dimension = output["dimension"];
			var text = "";

			if (dimension == null)
				text = "N/A";
			else
				text = dimension[NAME];

			element.val(text);
		},
	});
}

function loadDimensionToSelect2(params) {
	var element = params[ELEMENT];
	var domainId = params[DOMAIN_ID];
	var uniqueId = params[UNIQUE_ID];

	element.val(uniqueId);
	if (element.val() === uniqueId)
		return;

	var referenceMap = DocumentContent.getReferenceMap(domainId);
	if (referenceMap[uniqueId] == null) {
		loadDimension({
			domainId : domainId,
			uniqueId : uniqueId,
			postMethod : function(output) {
				var dimension = output["dimension"];

				var name = "N/A";
				if (dimension != null)
					name = dimension[NAME];
				referenceMap[uniqueId] = name;

				updateSelected({
					element : element,
					uniqueId : uniqueId,
					name : referenceMap[uniqueId],
				});

			},
		});
	} else {
		updateSelected({
			element : element,
			uniqueId : uniqueId,
			name : referenceMap[uniqueId],
		});
	}
}

function updateSelected(params) {
	var element = params[ELEMENT];
	var uniqueId = params[UNIQUE_ID];
	var name = params[NAME];

	var text = uniqueId + " - " + name;

	element.append($("<option>").val(uniqueId).text(text));

	element.val(uniqueId);
	element.data(NAME, name)
	element.trigger("change");
}

function loadDimensionToTextField(params) {
	var element = params[ELEMENT];
	var domainId = params[DOMAIN_ID];
	var uniqueId = params[UNIQUE_ID];

	if (element.data(UNIQUE_ID) === uniqueId)
		return;
	element.data(UNIQUE_ID, uniqueId);

	var referenceMap = DocumentContent.getReferenceMap(domainId);
	if (referenceMap[uniqueId] == null) {
		loadDimension({
			domainId : domainId,
			uniqueId : uniqueId,
			postMethod : function(output) {
				var dimension = output["dimension"];
				var name = "N/A";
				if (dimension != null)
					name = dimension[NAME];
				referenceMap[uniqueId] = name;

				element.val(uniqueId + " - " + name);
			},
		});
	} else {
		element.val(uniqueId + " - " + referenceMap[uniqueId]);
	}
}

function createFieldLogicList(clientLogicFieldList) {
	if (clientLogicFieldList == null)
		return {};

	var fieldLogicList = {};
	for ( var key in clientLogicFieldList) {
		fieldLogicList[clientLogicFieldList[key][FIELD]] = {
			required : clientLogicFieldList[key][REQUIRED],
			lockedOnInsert : clientLogicFieldList[key][LOCKED_ON_INSERT],
			lockedOnUpdate : clientLogicFieldList[key][LOCKED_ON_UPDATE],
		};
	}

	return fieldLogicList;
}

function isEmpty(value) {
	return value == null || value === "";
}

function renderView(field, input) {
	var dataType = field[DATA_TYPE];

	if (!(dataType === DATA_TYPE_COMPONENT))
		return RENDER_VIEW[dataType](input);

	return window[field[COMPONENT]].renderView(input);
}

function renderInput(field, input) {
	var dataType = field[DATA_TYPE];

	if (!(dataType === DATA_TYPE_COMPONENT))
		return RENDER_INPUT[dataType](input);

	return window[field[COMPONENT]].renderInput(input);
}

function getFormat(field, content) {
	var dataType = field[DATA_TYPE];

	if (!(dataType === DATA_TYPE_COMPONENT)) {
		return FORMAT[dataType](content);
	}

	return window[field[COMPONENT]].format(content);
}

function convertTo(field, content) {
	var dataType = field[DATA_TYPE];

	if (!(dataType === DATA_TYPE_COMPONENT)) {
		return CONVERT_TO[dataType](content);
	}

	return window[field[COMPONENT]].convertTo(content);
}

function renderFileInput(params) {
	var parentInputParams = params[PARENT_INPUT_PARAMS];
	var fileInputParams = params[FILE_INPUT_PARAMS];
	var dataType = params[DATA_TYPE];

	var id = parentInputParams[ID];
	var domainId = parentInputParams[DOMAIN_ID];
	var fieldId = parentInputParams[FIELD_ID];
	var required = parentInputParams[REQUIRED];
	var listenerClass = parentInputParams[LISTENER_CLASS];

	var fileInput = $("<input>", {
		name : "fileToUpload",
		type : "file",
	}).addClass("file");

	var buttonUrl = $("<a>", {
		target : "blank",
	}).addClass("fileInput btn btn-small btn-success") //
	.css("display", "none").text(TEXT_VIEW);

	fileInput.on(LISTENER_FILE_BROWSE, function(event) {
		$(this).fileinput("clear");
	});

	fileInput.on(LISTENER_FILE_BATCH_SELECTED, function(event) {
		$(this).fileinput(COMMAND_UPLOAD);
	});

	fileInput.on(LISTENER_FILE_CLEAR, function(event) {
		buttonUrl.css("display", "none");
		buttonUrl.attr("href", "");
	});

	fileInput.on(LISTENER_FILE_UPLOADED, function(event, data, previewId, index) {
		var response = data.response;
		buttonUrl.css("display", "block");
		buttonUrl.attr("href", response["url"]);

		// disable preview for further action
		output.data("previewUsed", true);
	});

	var output = $("<div>", {
		id : id,
	});

	output.append($("<form>", {
		enctype : "multipart/form-data",
	}).append($("<div>").addClass("form-group").append(fileInput).append(buttonUrl)));

	var previewDocument = $("<div>").addClass("filePreview");

	if (dataType === DATA_TYPE_IMAGE) {
		var elementPreview = $("<img>", {
			src : "",
		}) //
		.css({
			"min-width" : MIN_WIDTH_IMAGE,
			"max-width" : MAX_WIDTH_IMAGE,
		})//
		.addClass("filePreview");

		previewDocument.append(elementPreview);
		previewDocument.append($("<br>"));
	} else if (dataType === DATA_TYPE_DOCUMENT) {
		var elementPreview = $("<a>", {
			id : id,
			value : "download",
			target : "blank",
			href : "",
		}).addClass("filePreview btn btn-success btn-small").text(TEXT_VIEW);

		previewDocument.append(elementPreview);
	}

	previewDocument.append($("<button>").addClass("btn btn-small btn-warning").text(TEXT_CLEAR).on("click", function(event) {
		output.find("div.filePreview").css("display", "none");
		output.find("form").css("display", "block");
		output.find("a.fileInput").attr("href", "");
	}));
	output.data("previewUsed", false);

	fileInput.fileinput(fileInputParams);

	output.append(previewDocument);

	previewDocument.css("display", "none");

	return output;
}

function getContentValue(params) {
	var element = params[ELEMENT];
	var field = params[FIELD];

	var value = element.data(DATA_VALUE);

	var dataType = field[DATA_TYPE];
	if (dataType === DATA_TYPE_BOOLEAN) {
		value = element.is(":checked");
	} else if (dataType === DATA_TYPE_IMAGE || dataType === DATA_TYPE_DOCUMENT) {
		value = element.find("a.fileInput").attr("href");
	}

	return value;
}

function getListenerClass(dataType) {
	if (dataType === DATA_TYPE_REFERENCE || dataType === DATA_TYPE_REFERENCE_LIST) {
		return SELECT_COMMAND;
	} else if (dataType === DATA_TYPE_COMPONENT) {
		return "";
	} else {
		return CLIENT_COMMAND;
	}
}

function query(params) {
	var domainId = params[DOMAIN_ID];

	var metadata = METADATA_LIST[domainId];
	var metadataContainer = metadata[METADATA_CONTAINER];
	var documentMetadata = metadataContainer[DOCUMENT_METADATA];
	var compositeMetadata = metadataContainer["compositeMetadataMap"][domainId];
	var fieldList = compositeMetadata[FIELD_LIST];

	var filterMap = {};
	for (var i = 0; i < fieldList.length; i++) {
		var fieldId = fieldList[i][FIELD];
		var dataType = fieldList[i][DATA_TYPE];

		if (!fieldList[i][SHOW_ON_SUMMARY] || fieldList[i][DATA_TYPE] === DATA_TYPE_REFERENCE_LIST)
			continue;

		if (dataType === DATA_TYPE_BOOLEAN) {
			filterMap[fieldId] = $("#" + PREFIX_FIELD + fieldId).is(":checked");
		} else if (dataType === DATA_TYPE_DATE) {
			filterMap[fieldId] = {
				dateStart : CONVERT_TO[dataType]($("#" + PREFIX_FIELD + fieldId + SUFFIX_DATE_START).val()),
				dateEnd : CONVERT_TO[dataType]($("#" + PREFIX_FIELD + fieldId + SUFFIX_DATE_END).val()),
			};
		} else {
			var contentRaw = $("#" + PREFIX_FIELD + fieldId).val();
			if (contentRaw == null || contentRaw === "")
				continue;

			filterMap[fieldId] = CONVERT_TO[dataType](contentRaw);
		}
	}

	restClientPost({
		command : COMMAND_COMPOSITE_QUERY,
		input : {
			secretKey : METADATA_SECRET_KEY_LIST[domainId],
			filterMap : filterMap,
		},
		postMethod : function(output) {
			renderResultList({
				elementId : COMPOSITE_LIST,
				domainId : domainId,
				fieldList : fieldList,
				documentOutput : output,
			});
		}
	});
}

function showPageLogin() {
	$(PAGE_SECTION).load(LOGIN_PATH, function() {
		$("#logo").attr("src", CLIENT[FIELD_LOGO]);
		$("body").css("background-image", "url(" + CLIENT[FIELD_BACKGROUND] + ")");
	});
}

function createButtonReferenceScan() {
	return $("<span>").addClass("input-group-addon reference-scan").append($("<span>").addClass("glyphicon glyphicon-qrcode"));
}

function createButtonReferenceClear() {
	return $("<span>").addClass("input-group-addon reference-clear").append($("<span>").addClass("glyphicon glyphicon-remove"))
}

function appendButtonReference(output) {
	if (APP_MODE === "MOBILE")
		output.append(createButtonReferenceScan());

	output.append(createButtonReferenceClear());
}

function pictureTakenError() {
}

function setContentImage(params) {
	var container = params["container"];
	var content = params["content"];

	var previewUsed = container.data("previewUsed");
	if (previewUsed == null || !previewUsed) {
		container.find("form").css("display", "none");
		container.find("div.filePreview").css("display", "block");

		container.data("previewUsed", true);
	}

	container.find("img.filePreview").attr("src", content);
	container.find("a.fileInput").attr("href", content);
}

function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (var i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function submitClientWebPush(params) {
	var endPoint = params["endPoint"];
	var key = params["key"];
	var token = params["token"];

	restClientPost({
		command : COMMAND_PAGE_REGISTER_WEB_PUSH,
		input : {
			userId : CLIENT[FIELD_USER],
			endPoint : endPoint,
			key : key,
			token : token,
		},
		postMethod : function(output) {
		}
	});
}

function createScrollableTable(params) {
	var parent = params[PARENT];
	var tableHead = params[TABLE_HEAD];
	var tableBody = params[TABLE_BODY];
	var listType = params[LIST_TYPE];

	tableHead.addClass(CLASS_TABLE);
	tableBody.addClass(CLASS_TABLE);

	var tableHeadWrapper = $("<div>").addClass(CLASS_HEADER_WRAPPER).append(tableHead);
	var tableBodyWrapper = $("<div>").addClass(CLASS_ROW_WRAPPER).append(tableBody).data(LIST_TYPE, listType);
	var gridCanvas = $("<div>").addClass(CLASS_GRID_CANVAS).append(tableHeadWrapper).append(tableBodyWrapper);
	var tableDiv = $("<div>").addClass(CLASS_GRID).append(gridCanvas);

	parent.append(tableDiv);

	if (listType === LIST) {
		parent.data(GRID_LIST).push(tableBodyWrapper);
	} else {
		arrangeScrollElement(tableBodyWrapper);
	}
}

function arrangeScrollElement(element) {
	element.scroll(function(e) {
		var headerElement = $(this).parent().children(DIV_HEADER_WRAPPER);
		headerElement.css({
			left : -$(this)[0].scrollLeft + "px",
		});
	});

	var parent = element.parent();
	var parentHeight = 0;

	var listType = element.data(LIST_TYPE);
	if (listType === LIST) {
		var top = parent.offset().top;
		var windowHeight = $(window).height();

		parentHeight = Math.max(windowHeight - top - 50, 100);
	} else if (listType === VIEW) {
		parentHeight = 200;
	} else {
		showError("Invalid ListType, provide '" + listType + "'");
		return;
	}

	parent.height(parentHeight);
	element.height(parent.height() - 30);
}

function saveDocument(event) {
	DocumentContent.saveDocument();
}

function renderFieldDateTime(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];
	var listenerClass = params[LISTENER_CLASS];
	var dateFormat = params[PARAM_DATE_FORMAT];

	var output = $("<div>").addClass("input-group date").css("width", "100%");
	var input = $("<input>", {
		id : id,
		type : "text",
	}).addClass("form-control dateTimePicker").data({
		"container" : "body"
	});

	if (!isEmpty(listenerClass))
		input.addClass(listenerClass);

	if (required)
		input.addClass(REQUIRED);

	output.append(input) //
	.append($("<span>").addClass("input-group-addon").append($("<span>").addClass("glyphicon glyphicon-remove"))) //
	.append($("<span>").addClass("input-group-addon").append($("<span>").addClass("glyphicon glyphicon-calendar")));

	output.datetimepicker(dateFormat);

	return output;
}