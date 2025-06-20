const connToken = "90934554|-31949210514913927|90959090";
const DBName = "Shipment-Management";
const RelationName = "Shipment-Relation";
const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIML = "/api/iml";
const jpdbIRL = "/api/irl";

$("#ShipNo").focus();

function saveRecNo2LS(jsonObj) {
    var record = JSON.parse(jsonObj.data).record;
    localStorage.setItem("ShipNo", record.ShipNo);
}

function fillData(jsonobj) {
    saveRecNo2LS(jsonobj);  // fixed the typo here
    var data = JSON.parse(jsonobj.data).record;
    $("#discription").val(data.discription);
    $("#src").val(data.src);
    $("#dest").val(data.dest);
    $("#shipdate").val(data.shipdate);
    $("#reachdate").val(data.reachdate);
}

function getShipIdAsJsonObj() {
    var Shipno = $("#ShipNo").val();
    return JSON.stringify({ ShipNo: Shipno });
}

function resetShipment() {
    $("#ShipNo").val("").prop("disabled", false);
    $("#discription").val("");
    $("#src").val("");
    $("#dest").val("");
    $("#shipdate").val("");
    $("#reachdate").val("");
    $("#save").prop("disabled", false);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", false);
    $("#ShipNo").focus();
}

function validateData() {
    var ShipNoVar = $("#ShipNo").val();
    var discriptionVar = $("#discription").val();
    var srcVar = $("#src").val();
    var destVar = $("#dest").val();
    var shipdateVar = $("#shipdate").val();
    var reachdateVar = $("#reachdate").val();

    if (ShipNoVar === "") {
        alert("Shipment Number Required");
        $("#ShipNo").focus();
        return "";
    }
    if (discriptionVar === "") {
        alert("Description Required");
        $("#discription").focus();
        return "";
    }
    if (srcVar === "") {
        alert("Source Required");
        $("#src").focus();
        return "";
    }
    if (destVar === "") {
        alert("Destination Required");
        $("#dest").focus();
        return "";
    }
    if (shipdateVar === "") {
        alert("Shipment Date Required");
        $("#shipdate").focus();
        return "";
    }
    if (reachdateVar === "") {
        alert("Reach Date Required");
        $("#reachdate").focus();
        return "";
    }

    var jsonStrObj = {
        ShipNo: ShipNoVar,
        discription: discriptionVar,
        src: srcVar,
        dest: destVar,
        shipdate: shipdateVar,
        reachdate: reachdateVar
    };
    return JSON.stringify(jsonStrObj);
}

function saveShipment() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;

    var putRequest = createPUTRequest(connToken, jsonStrObj, DBName, RelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonobj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (resJsonobj.status === 200) {
        alert("Shipment saved successfully.");
    } else {
        alert("Error saving shipment: " + resJsonobj.message);
    }
    resetShipment();
}

function updateShipment() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;

    var ShipNoKey = localStorage.getItem("ShipNo");  // retrieved by saveRecNo2LS
    var updateRequest = createUPDATERecordRequest(connToken, jsonStrObj, DBName, RelationName, ShipNoKey);
    jQuery.ajaxSetup({ async: false });
    var resJsonobj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (resJsonobj.status === 200) {
        alert("Shipment updated successfully.");
    } else {
        alert("Error updating shipment: " + resJsonobj.message);
    }
    resetShipment();
}

function existingShipment() {
    var shipIdJsonobj = getShipIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, DBName, RelationName, shipIdJsonobj);

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#change").prop("disabled", true);
        $("#reset").prop("disabled", false);
        $("#discription").focus();
    } else if (resJsonObj.status === 200) {
        fillData(resJsonObj);  // populate form
        $("#ShipNo").prop("disabled", true);
        $("#save").prop("disabled", true);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#discription").focus();
    }
}
