var CONVERT_TO = {
	SHORT_CODE : convertToCode,
	LONG_CODE : convertToCode,
	SHORT_STRING : convertToString,
	LONG_STRING : convertToString,
	INTEGER : convertToInteger,
	LONG : convertToInteger,
	DECIMAL : convertToDecimal,
	DECIMAL_PRECISION : convertToDecimalPrecision,
	BOOLEAN : convertToBoolean,
	DATE : convertToCode,
	TIME : convertToCode,
	DATE_TIME : convertToCode,
	REFERENCE : convertToString,
	REFERENCE_LIST : convertToList,
	IMAGE : convertToCode,
	DOCUMENT : convertToCode,
};

function convertToString(value) {
	if (value == null)
		return "";

	return value.toUpperCase();
}

function convertToCode(value) {
	if (value == null)
		return "";

	return value;
}

function convertToList(value) {
	if (value == null)
		return null;

	for (var i = 0; i < value.length; i++) {
		value[i] = value[i].toUpperCase();
	}

	return value;
}

function convertToInteger(value) {
	if (value == null || value === "")
		return 0;

	if (typeof value === TYPE_NUMBER)
		return value;

	value = WNUMB_INTEGER.from(value);
	if (!value || isNaN(value))
		return 0;

	return value;

}

function convertToDecimal(value) {
	if (value == null || value === "")
		return 0.00;

	if (typeof value === TYPE_NUMBER)
		return value;

	var decimalValue = parseFloat(value);
	if (!isNaN(decimalValue))
		return decimalValue;

	value = WNUMB_DECIMAL.from(value);
	if (!value || isNaN(value))
		return 0;

	return value;
}

function convertToDecimalPrecision(value) {
	if (value == null || value === "")
		return 0.00;

	if (typeof value === TYPE_NUMBER)
		return value;

	var decimalValue = parseFloat(value);
	if (!isNaN(decimalValue))
		return decimalValue;

	value = WNUMB_DECIMAL_PRECISION.from(value);
	if (!value || isNaN(value))
		return 0;

	return value;
}

function convertToBoolean(value) {
	if (value == null)
		return false;

	return value;
}
