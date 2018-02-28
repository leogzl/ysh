var YshMetadata = new function() {
};

YshMetadata.isCreatable = function(domainId, lineId) {
	var value = null;

	if (lineId == null)
		value = METADATA_LIST[domainId][CREATABLE_LIST][domainId];
	else
		value = METADATA_LIST[domainId][CREATABLE_LIST][domainId + "#" + lineId];

	return value == null ? true : value;
}

YshMetadata.isEditable = function(domainId, lineId) {
	var value = null;

	if (lineId == null)
		value = METADATA_LIST[domainId][EDITABLE_LIST][domainId];
	else
		value = METADATA_LIST[domainId][EDITABLE_LIST][domainId + "#" + lineId];

	return value == null ? true : value;
}

YshMetadata.getMetadata = function() {
	var domainId = DocumentContent.getDomainId();

	return METADATA_LIST[domainId];
}

YshMetadata.getDocumentMetadata = function() {
	var domainId = DocumentContent.getDomainId();

	return YshMetadata.getMetadata()[METADATA_CONTAINER][DOCUMENT_METADATA];
}

YshMetadata.getClientCommand = function() {
	var domainId = DocumentContent.getDomainId();

	return YshMetadata.getMetadata()[CLIENT_COMMAND];
}

YshMetadata.getClientCommandLineMap = function() {
	var domainId = DocumentContent.getDomainId();

	return YshMetadata.getMetadata()[CLIENT_COMMAND_LINE_MAP];
}

YshMetadata.getFieldLogicList = function() {
	return YshMetadata.getMetadata()[FIELD_LOGIC_LIST];
}

YshMetadata.getFieldLineLogicList = function() {
	return YshMetadata.getMetadata()[FIELD_LINE_LOGIC_LIST];
}
