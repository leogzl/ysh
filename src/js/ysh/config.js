var SERVER_CDN = "https://cdn.n-tco.com/upload.php";
var WEB_PUSH_APPLICATION_SERVER_KEY = "BNN1Ey8U66RW86z7pdL1cAqCozUlnpBLQGtW4LJh9lR_CX_KkWajMjwmMcZIDjTGLoHDhefOhCSrUVEjnXIhcRQ";

var WEB_PUSH_STATUS = "webPushStatus";

var MIN_WIDTH_BOOLEAN = "60px";
var MIN_WIDTH_NUMBER = "120px";
var MIN_WIDTH_TEXT = "160px";
var MIN_WIDTH_DATE = "150px";

var MIN_WIDTH_IMAGE = "150px";
var MAX_WIDTH_IMAGE = "200px";

var COMMAND_METADATA_LOAD = "/rest/metadata/load";

var COMMAND_DOCUMENT_LOAD = "/rest/document/load";
var COMMAND_DOCUMENT_CREATE = "/rest/document/create";
var COMMAND_DOCUMENT_INSERT = "/rest/document/insert";
var COMMAND_DOCUMENT_UPDATE = "/rest/document/update";

var COMMAND_DIMENSION_QUERY = "/rest/dimension/query";
var COMMAND_COMPOSITE_QUERY = "/rest/composite/query";

var COMMAND_DIMENSION_LOAD = "/rest/dimension/load";

var COMMAND_TRANSACTION_PROCESS = "/rest/transaction/process";

var COMMAND_PAGE_INITIALIZE = "/rest/page/initialize";
var COMMAND_PAGE_AUTHENTICATE = "/rest/page/authenticate";
var COMMAND_PAGE_BUILD = "/rest/page/build";
var COMMAND_PAGE_REGISTER_WEB_PUSH = "/rest/page/registerWebPush";

var SECRET_KEY_LIST = {};
var METADATA_SECRET_KEY_LIST = {};
var METADATA_LIST = {};

var SECRET_KEY = "secretKey";
var FIELD_METADATA_SECRET_KEY_LIST = "metadataSecretKeyList";

var ELEMENT_ID = "elementId";
var ELEMENT = "element";

var TITLE = "title";
var CONTENT = "content";

var PREFIX_FIELD = "YSHFIELD-";
var PREFIX_LINE = "YSHLINE-";

var ELEMENT_DOMAIN_ID = "#domainId";

var DOCUMENT_CONTENT = "documentContent";
var DOCUMENT_SECTION = "documentSection";

var ELEMENT_DOCUMENT_CONTENT = "#documentContent";
var ELEMENT_DOCUMENT_SECTION = "#documentSection";

var COMPOSITE_QUERY = "#compositeQuery";
var DOCUMENT_CREATE = "#documentCreate";
var DOCUMENT_UPDATE = "#documentUpdate";
var DOCUMENT_INSERT = "#documentInsert";
var DOCUMENT_NONE = "#documentNone";

var MENU = ".menu";

var DOCUMENT_EDIT = ".documentEdit";
var DOCUMENT_VIEW = ".documentView";
var DOCUMENT_PRINT = ".documentPrint";

var COMPOSITE_LIST = "#compositeList";

var METADATA = "metadata";
var METADATA_CONTAINER = "metadataContainer";
var DOCUMENT_METADATA = "documentMetadata";
var COMPOSITE_METADATA_MAP = "compositeMetadataMap";

var FIELD_MAP = "fieldMap";
var FIELD_ORDER_LIST = "fieldOrderList";

var DOMAIN_PAGE = "YSH.PAGE.01";

var FIELD_USER = "user";
var FIELD_CLIENT = "client";
var FIELD_LOGO = "logo";
var FIELD_BACKGROUND = "background";
var FIELD_SERVER = "server";

var CLIENT_LOGIC = "clientLogic";
var CLIENT_LINE_LOGIC = "clientLineLogic";

var CLIENT_COMMAND = "clientCommand";
var SELECT_COMMAND = "selectCommand";

var CLASS_CLIENT_COMMAND = ".clientCommand";
var CLASS_SELECT_COMMAND = ".selectCommand";

var CLIENT_COMMAND_LINE_MAP = "clientCommandLineMap";

var CLIENT_LOGIC_FIELD_LIST = "clientLogicFieldList";
var CLIENT_LINE_LOGIC_FIELD_LIST = "clientLineLogicFieldList";

var FIELD_LIST = "fieldList";

var FIELD_LOGIC_LIST = "fieldLogicList";
var FIELD_LINE_LOGIC_LIST = "fieldLineLogicList";

var DOCUMENT_VALUE = "documentValue";

var DATA_TYPE = "dataType";

var INDEX = "index";
var LINE_ID = "lineId";

var DATA_VALUE = "value";

var LIST_TYPE = "LIST_TYPE";
var LIST = "LIST";
var VIEW = "VIEW";

var PARENT = "PARENT";
var TABLE_HEAD = "TABLE_HEAD";
var TABLE_BODY = "TABLE_BODY";
var GRID_LIST = "GRID_LIST";

var CLASS_HEADER_WRAPPER = "header-wrapper";
var DIV_HEADER_WRAPPER = "div.header-wrapper";
var CLASS_ROW_WRAPPER = "row-wrapper";
var CLASS_GRID_CANVAS = "grid-canvas";
var CLASS_GRID = "grid";
var CLASS_TABLE = "table table-striped table-hover";

var ID = "id";

var DOMAIN_ID = "domainId";
var PAGE_ID = "pageId";

var ENTITY_ID = "entityId";
var UNIQUE_ID = "uniqueId";
var FIELD_ID = "fieldId";

var COMMAND_TYPE_ID = "commandTypeId";
var ROLE_ID = "roleId";
var USER_ID = "userId";

var COMMAND = "commmand";
var COMMAND_LIST = {
	CREATE : COMMAND_DOCUMENT_INSERT,
	EDIT : COMMAND_DOCUMENT_UPDATE,
};

var COMMAND_TYPE = "commandType";
var COMMAND_TYPE_DRAFT = "15";
var COMMAND_TYPE_SAVE = "20";
var COMMAND_TYPE_APPROVE = "30";
var COMMAND_TYPE_VOID = "40";

var MODE = "mode";
var MODE_CREATE = "CREATE";
var MODE_EDIT = "EDIT";
var MODE_VIEW = "VIEW";

var DOCUMENT_TYPE = "documentType";
var DOCUMENT_TYPE_DEFAULT = "DEFAULT";
var DOCUMENT_TYPE_TRANSACTION = "TRANSACTION";

var NAME = "name";
var TRANSACTION_STATUS = "TRANSACTION_STATUS";

var TRANSACTION_STATUS_CREATED = "00";
var TRANSACTION_STATUS_DRAFTING_IN_PROGRESS = "05";

var CLICK = "click";
var CHANGE = "change";

var CLIENT_URL = "clientUrl";
var PAGE = "page";

var DOMAIN = "domain";
var FIELD = "field";

var FIELD_LOGIC = "fieldLogic";
var REQUIRED = "required";
var LOCKED = "locked";

var LOCKED_ON_INSERT = "lockedOnInsert";
var LOCKED_ON_UPDATE = "lockedOnUpdate";

var FIELD_UNIQUE_ID = "UNIQUE_ID";
var FIELD_UNIQUE_LINE_ID = "UNIQUE_LINE_ID";
var FIELD_NAME = "NAME";
var FIELD_LINE_MAP = "fieldLineMap";
var FIELD_LINE_ORDER_LIST = "fieldLineOrderList";

var FIELD_REFERENCE = "fieldReference";
var DOMAIN_REFERENCE = "domainReference";

var SHOW_ON_SUMMARY = "showOnSummary";
var SIMPLE_FILTER = "simpleFilter";
var METADATA_ID = "metadataId";

var FILTER_LIST = "filterList";
var RESULT_LIST = "resultList";
var FIELD_LIST = "fieldList";

var DOCUMENT = "document";
var DIMENSION = "dimension";
var DOCUMENT_OUTPUT = "documentOutput";

var REFERENCE_MAP = "referenceMap";
var REFERENCE_VALUE = "referenceValue";

var BUTTON_DOCUMENT_INSERT = "documentInsert";
var BUTTON_DOCUMENT_UPDATE = "documentUpdate";
var BUTTON_DOCUMENT_NONE = "documentNone";

var BUTTON_LINE_DELETE = ".buttonLineDelete";
var BUTTON_LINE_NEW = ".buttonLineNew";

var FOREIGN_ID = "FOREIGN_ID";
var VALUE = "VALUE";

var LINE_ORDER_LIST = "lineOrderList";
var LINE_ORDER_MAP = "lineOrderMap";

var CONTENT_MAP = "contentMap";
var CONTENT_LINE_MAP = "contentLineMap";

var POST_METHOD = "postMethod";
var LISTENER_CLASS = "listenerClass";

var GENERATED = "**GENERATED**";

var CREATABLE_LIST = "creatableList";
var EDITABLE_LIST = "editableList";

var APP_MODE_WEB = "WEB";
var APP_MODE_MOBILE = "MOBILE";

var PARAM_DATE_FORMAT = "dateFormat";
/**
 * FILE INPUT
 */
var LISTENER_FILE_BATCH_SELECTED = "filebatchselected";
var LISTENER_FILE_CLEAR = "fileclear";
var LISTENER_FILE_UPLOADED = "fileuploaded";
var LISTENER_FILE_BROWSE = "filebrowse";
var COMMAND_UPLOAD = "upload";

var FILE_INPUT_PARAMS = "fileInputParams";
var PARENT_INPUT_PARAMS = "parentInputParams";

var TEXT_VIEW = "View";
var TEXT_CLEAR = "Clear";

var FILE_INPUT_DOCUMENT_PARAM = {
	uploadUrl : SERVER_CDN,
	overwriteInitial : false,
	maxFileSize : 10000,
	maxFileCount : 1,
	showPreview : false,
	showUpload : false,
	uploadExtraData : function() {
		return {
			clientId : CLIENT[FIELD_CLIENT],
		}
	},
};

var FILE_INPUT_IMAGE_PARAM = {
	uploadUrl : SERVER_CDN,
	allowedFileExtensions : [ "jpg", "png" ],
	overwriteInitial : false,
	maxFileSize : 10000,
	maxFileCount : 1,
	validateInitialCount : true,
	showPreview : true,
	showUpload : false,
	uploadExtraData : function() {
		return {
			clientId : CLIENT[FIELD_CLIENT],
		}
	},
};

/**
 * CELL STYLE FORMAT
 */

CELL_STYLE_LEFT = {
	"text-align" : "left",
};

CELL_STYLE_RIGHT = {
	"text-align" : "right",
};

CELL_STYLE_CENTER = {
	"text-align" : "center",
};

/**
 * NUMBER FORMAT with WNUMB
 */
var WNUMB_INTEGER = wNumb({
	prefix : '',
	decimals : 0,
	thousand : ','
});

var WNUMB_DECIMAL = wNumb({
	prefix : '',
	decimals : 2,
	thousand : ','
});

var WNUMB_DECIMAL_PRECISION = wNumb({
	prefix : '',
	decimals : 4,
	thousand : ','
});

/**
 * BOOLEAN FORMAT
 */

var INPUT_BOOLEAN_DATA = {
	"on-text" : "YES",
	"off-text" : "NO",
};

/**
 * TYPE NUMBER
 */

var TYPE_NUMBER = "number";

var SUFFIX = "suffix";

var SUFFIX_LAST = "-last";
var SUFFIX_DATE_START = "-dateStart";
var SUFFIX_DATE_END = "-dateEnd";

$.fn.select2.defaults.set("theme", "bootstrap");

var DATE_FORMAT = {
	format : "dd-M-yyyy",
	weekStart : 0,
	todayBtn : true,
	todayHighlight : true,
	autoclose : true,
	startView : 2,
	minView : 2,
	forceParse : true,
	showMeridian : false,
	pickerPosition : "bottom-left",
};

var TIME_FORMAT = {
	format : "hh:ii",
	weekStart : 0,
	todayBtn : true,
	todayHighlight : true,
	autoclose : true,
	startView : 1,
	minView : 0,
	minuteStep : 10,
	forceParse : true,
	showMeridian : false,
	pickerPosition : "bottom-left",
};

var DATE_TIME_FORMAT = {
	format : "dd-M-yyyy hh:ii",
	weekStart : 0,
	todayBtn : true,
	todayHighlight : true,
	autoclose : true,
	startView : 2,
	minView : 0,
	forceParse : true,
	showMeridian : false,
	pickerPosition : "bottom-left",
};

var COMPONENT = "component";

var PAGE_SECTION = "#pageSection";
var MESSAGE_SECTION = "#messageSection";
var LOGIN_PATH = "./page/login.html";

var DATA_TYPE_COMPONENT = "COMPONENT";
var DATA_TYPE_BOOLEAN = "BOOLEAN";
var DATA_TYPE_IMAGE = "IMAGE";
var DATA_TYPE_DOCUMENT = "DOCUMENT";
var DATA_TYPE_DATE = "DATE";
var DATA_TYPE_REFERENCE = "REFERENCE";
var DATA_TYPE_REFERENCE_LIST = "REFERENCE_LIST";

$.fn.datetimepicker.dates['en'] = {
	days : [ 'MONDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY' ],
	daysShort : [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN' ],
	daysMin : [ 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU' ],
	months : [ 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER' ],
	monthsShort : [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ],
	meridiem : [ 'AM', 'PM' ],
	suffix : [ 'ST', 'ND', 'RD', 'TH' ],
	today : 'TODAY',
	clear : 'CLEAR'
};
