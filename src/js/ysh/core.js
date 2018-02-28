function YshField(params) {
	// String field
	this.field = params[FIELD];

	// String name
	this.name = params[NAME];

	// YshDataType dataType;
	this.dataType = params[DATA_TYPE];

	// String fieldReference
	this.fieldReference = params[FIELD_REFERENCE];

	// Boolean showOnSummary
	this.showOnSummary = params[SHOW_ON_SUMMARY];
}

function YshMetadataInitialize(params) {
	// String domainId
	this.domainId = params[DOMAIN_ID];

	// String domainName
	this.domainName = params["domainName"];

	// List<YshField> fieldList
	this.fieldList = params[FIELD_LIST];

	// List<String> lineOrderList
	this.lineOrderList = params[LINE_ORDER_LIST];

	// Map<String, String> lineOrderMap
	this.lineOrderMap = params[LINE_ORDER_MAP];

	// Map<String, List<YshField>> fieldLineList
	this.fieldLineList = params["fieldLineList"];
}

function YshDocument(params) {
	// Long id
	this.id = params[ID];

	// String uniqueId
	this.uniqueId = params[UNIQUE_ID];

	// Map<String, Object> contentMap
	this.contentMap = params["contentMap"];

	// Map<String, List<Map<String, Object>>> contentLineMap
	this.contentLineMap = params["contentLineMap"];
}

function YshRestMetadata(params) {
	// String metadataId
	this.metadataId = params[METADATA_ID];

	// YshMetadataInitialize metadataInitialize
	this.metadataInitialize = params["metadataInitialize"];
}

function YshRestDocument(params) {
	// String domainId
	this.domainId = params[DOMAIN_ID];

	// String uniqueId
	this.uniqueId = params[UNIQUE_ID];

	// YshDocument document
	this.document = params[DOCUMENT];

	// YshFilter[] filterList
	this.filterList = params[FILTER_LIST];

	// List<YshDocument> resultList
	this.resultList = params[RESULT_LIST];
}

function YshRestDimension(params) {
	// String domainId
	this.domainId = params[DOMAIN_ID];

	// String uniqueId
	this.uniqueId = params[UNIQUE_ID];

	// YshDimension dimension
	this.dimension = params[DIMENSION];

	// SimpleFilter simpleFilter
	this.simpleFilter = params[SIMPLE_FILTER];

	// List<YshDimension> resultList
	this.resultList = params[RESULT_LIST];
}

function yshExecute(params) {
	var secretKey = params[SECRET_KEY];
	var process = params["process"];

	if (SECRET_KEY_LIST[secretKey] == null) {
		restClientPost({
			command : COMMAND_METADATA_LOAD,
			input : {
				secretKey : secretKey,
			},
			postMethod : function(output) {
				var metadataId = output[METADATA_CONTAINER][UNIQUE_ID];
				SECRET_KEY_LIST[secretKey] = metadataId;
				METADATA_SECRET_KEY_LIST[metadataId] = secretKey;
				METADATA_LIST[metadataId] = output;

				var outputContainer = output[METADATA_CONTAINER];

				var metadataSecretKeyList = output[FIELD_METADATA_SECRET_KEY_LIST];
				for ( var key in metadataSecretKeyList)
					METADATA_SECRET_KEY_LIST[key] = metadataSecretKeyList[key];

				var clientLogicFieldList = output[CLIENT_LOGIC_FIELD_LIST];
				output[FIELD_LOGIC_LIST] = createFieldLogicList(clientLogicFieldList);

				var clientLineLogicFieldList = output[CLIENT_LINE_LOGIC_FIELD_LIST];
				output[FIELD_LINE_LOGIC_LIST] = {};

				var lineOrderList = outputContainer[DOCUMENT_METADATA][LINE_ORDER_LIST];
				if (lineOrderList != null) {
					for (var i = 0; i < lineOrderList.length; i++) {
						var lineId = lineOrderList[i];
						output[FIELD_LINE_LOGIC_LIST][lineId] = createFieldLogicList(clientLineLogicFieldList[lineId]);
					}
				}

				// clear all the CLIENT_LOGIC_* to avoid misreading
				output[CLIENT_LOGIC_FIELD_LIST] = null;
				output[CLIENT_LINE_LOGIC_FIELD_LIST] = null;

				process();
			}
		});
	} else {
		process();
	}
}
