var FORMAT = {
	SHORT_CODE : formatCode,
	LONG_CODE : formatCode,
	SHORT_STRING : formatString,
	LONG_STRING : formatString,
	INTEGER : formatInteger,
	LONG : formatInteger,
	DECIMAL : formatDecimal,
	DECIMAL_PRECISION : formatDecimalPrecision,
	DATE : formatDate,
	DATE_TIME : formatDate,
	BOOLEAN : formatBoolean,
	TIME : formatTime,
	REFERENCE : formatReference,
	REFERENCE_LIST : formatReferenceList,
	IMAGE : formatCode,
	DOCUMENT : formatCode,
};

function formatInteger(value) {
	if (value == null || value === "")
		return "0";

	return WNUMB_INTEGER.to(value);
}

function formatDecimal(value) {
	if (value == null || value === "")
		return "0.00";

	return WNUMB_DECIMAL.to(value);
}

function formatDecimalPrecision(value) {
	if (value == null || value === "")
		return "0.0000";

	return WNUMB_DECIMAL_PRECISION.to(value);
}

function formatDate(value) {
	return value;
}

function formatBoolean(value) {
	if (value) {
		return $("<div>", {
			align : "center",
		}).addClass("fa fa-check");
	} else {
		return "";
	}
}

function formatString(value) {
	return value;
}

function formatCode(value) {
	return value;
}

function formatReference(content) {
	return content[FOREIGN_ID] + " - " + content[VALUE];
}

function formatReferenceList(content) {
	var list = $("<ul>").addClass("reference-list-container");

	if (content != null) {
		for (var i = 0; i < content.length; i++) {
			var row = $("<li>").addClass("reference-list-row").appendTo(list);
			row.text(formatReference(content[i]));
		}
	}

	return list;
}

function formatTime(value) {
	return value;
}
