var YshTransactionButton = function() {
};

YshTransactionButton.align = function() {
	return "left";
};

YshTransactionButton.convert = function(value) {
	if (value == null)
		return "";

	return value;
}

YshTransactionButton.format = function(value) {
	return value;
}

YshTransactionButton.convertTo = function(value) {
	return value;
}

YshTransactionButton.styleCell = function() {
	return {
		"text-align" : "left"
	};
}

YshTransactionButton.renderInput = function(params) {
	return renderButton(params);
}

YshTransactionButton.renderView = function(params) {
	return renderButton(params);
	// var id = params[ID];
	// var fieldId = params[FIELD_ID];
	//
	// return $("<input>", {
	// id : id,
	// type : "text",
	// readonly : true,
	// }).addClass("form-control").css({
	// "text-align" : "left",
	// }).css("min-width", MIN_WIDTH_TEXT);
}

function renderButton(params) {
	var id = params[ID];
	var domainId = params[DOMAIN_ID];
	var fieldId = params[FIELD_ID];
	var required = params[REQUIRED];

	var text = $("<p>").css("display", "none");

	var button = $("<button>") //
	.addClass("btn btn-default YshTransactionButton") //
	.text(" AUTHORIZE").prepend($("<span>").addClass("glyphicon glyphicon-check"));

	var element = $("<div>", {
		id : id,
	});
	element.append(text)
	element.append(button);

	return element;
}

YshTransactionButton.setValue = function(params) {
	var element = params[ELEMENT];
	var value = params[DATA_VALUE];

	element.data(DATA_VALUE, value);

	if (value === "CLICKED") {
		element.children("p").css("display", "block").html("CLICKED");
		element.children("button").css("display", "none");
	} else {
		element.children("button").css("display", "block");
	}
}

YshTransactionButton.processTransaction = function(params) {
	var domainId = params[DOMAIN_ID];
	var document = params[DOCUMENT];
	var uniqueId = params[UNIQUE_ID];
	var roleId = params[ROLE_ID];
	var commandTypeId = params[COMMAND_TYPE_ID];
	var userId = params[USER_ID];

	var restInput = {
		secretKey : METADATA_SECRET_KEY_LIST[domainId],
		uniqueId : uniqueId,
		document : document,
		roleId : roleId,
		commandTypeId : commandTypeId,
		userId : userId,
	};

	restClientPost({
		command : COMMAND_TRANSACTION_PROCESS,
		input : restInput,
		postMethod : function(output) {
			var uniqueId = output[UNIQUE_ID];

			DocumentContent.loadDocument({
				mode : MODE_EDIT,
				domainId : domainId,
				uniqueId : uniqueId
			});
		}
	});
}

$(document).on(CLICK, ".YshTransactionButton", function(event) {
	var element = getElementContainer($(this));

	var lineId = element.data(LINE_ID);
	var index = element.data(INDEX);
	var commandTypeId = $("#" + PREFIX_FIELD + lineId + "-" + index + "-commandType").data(UNIQUE_ID);
	var roleId = $("#" + PREFIX_FIELD + lineId + "-" + index + "-role").val();

	var document = null;
	var uniqueId = null;

	var domainId = DocumentContent.getDomainId();
	var userId = CLIENT[FIELD_USER];

	if (commandTypeId === COMMAND_TYPE_DRAFT || commandTypeId === COMMAND_TYPE_SAVE) {
		document = DocumentContent.getDocumentValue();
	} else if (commandTypeId === COMMAND_TYPE_APPROVE || commandTypeId === COMMAND_TYPE_VOID) {
		uniqueId = $("#" + PREFIX_FIELD + FIELD_UNIQUE_ID).data(DATA_VALUE);
	} else {
		showMessage("Invalid commandType : '" + commandTypeId + "'");
		return;
	}

	var input = {
		domainId : domainId,
		uniqueId : uniqueId,
		document : document,
		roleId : roleId,
		commandTypeId : commandTypeId,
		userId : userId,
	}

	YshTransactionButton.processTransaction(input);
});
