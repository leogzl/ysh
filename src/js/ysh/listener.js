$(document).on(CLICK, MENU, function(event) {
	var secretKey = $(this).data(SECRET_KEY);
	var domainId = $(this).data(DOMAIN);
	var pageId = $(this).data(PAGE);

	if (secretKey != null) {
		yshExecute({
			secretKey : secretKey,
			process : function() {
				DocumentContent.listDocument({
					domainId : domainId,
				});
			}
		});
	} else if (pageId != null) {
		DocumentContent.loadPage({
			pageId : pageId,
		});
	}
});

$(document).on(CLICK, COMPOSITE_QUERY, function(event) {
	var domainId = $(this).data(DOMAIN_ID);

	query({
		domainId : domainId,
	});
});

$(document).on(CLICK, DOCUMENT_NONE, function(event) {
	var index = DocumentContent.getElement().data(INDEX);

	Breadcrumb.close(index);
});

$(document).on(CLICK, DOCUMENT_CREATE, function(event) {
	DocumentContent.loadDocument({
		mode : MODE_CREATE,
		domainId : DocumentContent.getDomainId(),
	});
});

$(document).on(CLICK, DOCUMENT_EDIT, function(event) {
	var entityId = $(this).data(ENTITY_ID);

	DocumentContent.loadDocument({
		mode : MODE_EDIT,
		domainId : DocumentContent.getDomainId(),
		uniqueId : entityId,
	});
});

$(document).on(CLICK, DOCUMENT_VIEW, function(event) {
	var entityId = $(this).data(ENTITY_ID);

	DocumentContent.loadDocument({
		mode : MODE_VIEW,
		domainId : DocumentContent.getDomainId(),
		uniqueId : entityId,
	});
});

$(document).on(CLICK, DOCUMENT_INSERT, saveDocument);
$(document).on(CLICK, DOCUMENT_UPDATE, saveDocument);

$(document).on(CLICK, DOCUMENT_PRINT, function(event) {
	var domainId = $(this).data(DOMAIN_ID);
	var entityId = $(this).data(ENTITY_ID);

	console.log("documentPrint");

	if (domainId === "TRK.BATCH_NUMBER.01") {
		console.log("PRINT");

		restClientPost({
			command : COMMAND_DOCUMENT_LOAD,
			input : {
				secretKey : METADATA_SECRET_KEY_LIST[domainId],
				uniqueId : entityId,
			},
			postMethod : function(output) {
				console.log(output);

				var generatedBatchNumber = output["document"]["contentMap"]["generatedBatchNumber"];
				var heatNumber = output["document"]["contentMap"]["heatNumber"];
				var productId = output["document"]["contentMap"]["productId"];
				var name = output["document"]["contentMap"]["NAME"];
				var dimension = output["document"]["contentMap"]["dimension"];
				var drawingCode = output["document"]["contentMap"]["drawing"];
				var material = output["document"]["contentMap"]["material"];
				var certificate = output["document"]["contentMap"]["certificate"] + " " + output["document"]["contentMap"]["certificateVersion"];

				window.open("https://app.n-tco.com/rest/report/print?BATCH_NUMBER_ID=" + generatedBatchNumber + //
				"&HEAT_NUMBER=" + heatNumber + "&PRODUCT_ID=" + productId + "&NAME=" + name + //
				"&DIMENSION=" + dimension + "&DRAWING_CODE=" + drawingCode + "&MATERIAL=" + material + //
				"&CERTIFICATE=" + certificate + "", "_blank");
			}
		});
	}
});

$(document).on("select2:select", CLASS_SELECT_COMMAND, function(event) {
	var element = getElementContainer($(this));
	var domainId = element.data(DOMAIN_ID);

	var content = $(this).val();
	$(this).data(DATA_VALUE, content);

	runClientCommand();
});

$(document).on(CHANGE, CLASS_CLIENT_COMMAND, function(event) {
	var element = getElementContainer($(this));
	var dataType = element.data(DATA_TYPE);

	var content = $(this).val();
	var value = CONVERT_TO[dataType](content);
	$(this).data(DATA_VALUE, value);

	runClientCommand();
});

$(document).on(CLICK, BUTTON_LINE_DELETE, function(event) {
	$(this).parent().parent().remove();
});

$(document).on(CLICK, BUTTON_LINE_NEW, function(event) {
	var clientCommandLineMap = YshMetadata.getClientCommandLineMap();
	var documentMetadata = YshMetadata.getDocumentMetadata();
	var fieldLineMap = documentMetadata[FIELD_LINE_MAP];

	var lineId = $(this).data(LINE_ID);

	var parent = $(this).parent().parent();
	var index = parent.parent().data(INDEX);

	var tr = $("<tr>", {
		id : PREFIX_LINE + lineId + "-" + index,
	}).insertBefore(parent);

	var tbody = parent.parent();

	renderNewLine({
		element : tr,
		lineId : lineId,
		index : index,
	});

	var contentLine = {};
	for ( var fieldId in fieldLineMap[lineId]) {
		if (fieldId === FIELD_UNIQUE_LINE_ID)
			continue;

		var value = $("#" + PREFIX_LINE + lineId + "-" + index + "-" + fieldId).data(DATA_VALUE);
		var field = fieldLineMap[lineId][fieldId];
		contentLine[fieldId] = convertTo(field, value);
	}

	var _ = contentLine;
	eval(clientCommandLineMap[lineId]);

	for ( var fieldId in fieldLineMap[lineId]) {
		if (fieldId === FIELD_UNIQUE_LINE_ID)
			continue;

		var elementId = "#" + PREFIX_FIELD + lineId + "-" + index + "-" + fieldId;
		var element = $(elementId);
		if (element.length == 0)
			showMessage("Cannot get element : '" + elementId + "'");

		var content = contentLine[fieldId];
		setContentValue({
			element : element,
			content : content,
			field : fieldLineMap[lineId][fieldId],
		});
	}

	index++;
	parent.parent().data("index", index);
});

$(document).on(CLICK, ".reference-clear", function(event) {
	var element = $(this).parent().find("select");

	element.val("").trigger("change");
	element.data(DATA_VALUE, "");

	runClientCommand();
});

$(document).on(CLICK, ".reference-scan", function(event) {
	var element = $(this).parent().find("select");
	var referenceDomainId = element.data(DOMAIN_REFERENCE);

	cordova.plugins.barcodeScanner.scan(function(result) {
		if (result == null)
			return;

		var text = result["text"];
		if (text == null || text === "")
			return;

		var referenceUniqueId = text;

		loadDimensionToSelect2({
			element : element,
			domainId : referenceDomainId,
			uniqueId : referenceUniqueId,
		});
	}, function(error) {
		showMessage("Scanning failed: " + error);
	});
});

$(document).on(CLICK, ".take-picture", function(event) {
	var container = getElementContainer($(this));

	var cameraParameter = {
		quality : 100,
		destinationType : Camera.DestinationType.DATA_URL,
		sourceType : Camera.PictureSourceType.CAMERA,
		encodingType : Camera.EncodingType.JPEG,
		cameraDirection : 1,
		saveToPhotoAlbum : true,
	};

	var pictureTakenSuccess = function(imageData) {
		$.ajax({
			type : "POST",
			url : SERVER_CDN,
			data : {
				clientId : CLIENT[FIELD_CLIENT],
				data : imageData,
			},
			success : function(result) {
				var data = JSON.parse(result);
				var content = data["url"];

				if (content == null)
					return;

				setContentImage({
					container : container,
					content : content,
				});
			},
		});
	};

	navigator.camera.getPicture(pictureTakenSuccess, pictureTakenError, cameraParameter);
});

$(document).on(CLICK, "#logout", function(event) {
	location.reload();
});

$(document).on(CLICK, "#changePassword", function(event) {
	var element = $("<div>").load("./page/changePassword.html");
	element.data(TITLE, "CHANGE PASSWORD");

	DocumentContent.render(element);
});

$(document).on(CLICK, "#webPush", function(event) {
	publishClientWebPush();
});

$(document).ready(function() {
	$(MESSAGE_SECTION).load("./page/message.html");
	registerWebPush();

	var clientUrlId = (APP_MODE === APP_MODE_MOBILE ? APP_CLIENT_URL : window.location.origin).toUpperCase();

	// load ClientUrl
	restClientPost({
		command : COMMAND_PAGE_INITIALIZE,
		input : {
			clientUrlId : clientUrlId,
		},
		postMethod : function(output) {
			var clientUrl = output[CLIENT_URL];
			if (clientUrl == null) {
				showMessage("Cannot load configuration for URL: '" + clientUrlId + "'");
				return;
			}

			var clientUrlContentMap = clientUrl[CONTENT_MAP];

			CLIENT[FIELD_CLIENT] = clientUrlContentMap[FIELD_CLIENT];
			CLIENT[FIELD_LOGO] = clientUrlContentMap[FIELD_LOGO];
			CLIENT[FIELD_BACKGROUND] = clientUrlContentMap[FIELD_BACKGROUND];
			CLIENT[FIELD_NAME] = clientUrlContentMap[FIELD_NAME];
			SERVER = clientUrlContentMap[FIELD_SERVER];

			document.title = CLIENT[FIELD_NAME];
			showPageLogin();
		}
	});
});

$(document).on(CLICK, "#buttonAuthenticate", function(event) {
	var userId = $("#textUserId").val();
	var password = $("#textPassword").val();

	userId = userId.toUpperCase();

	// load Password
	restClientPost({
		command : COMMAND_PAGE_AUTHENTICATE,
		input : {
			userId : userId,
			password : password,
		},
		postMethod : function(output) {
			CLIENT[FIELD_USER] = userId;

			$(PAGE_SECTION).load("./page/home.html", function() {
				renderHome();
			});

			publishClientWebPush();
		}
	});
});

$(document).on(CLICK, ".breadcrumb-load", function(event) {
	var index = $(this).data(INDEX);

	DocumentContent.loadContent(Breadcrumb.load(index));
});

$(document).on(CLICK, ".breadcrumb-close", function(event) {
	var index = $(this).data(INDEX);

	Breadcrumb.close(index);
});
