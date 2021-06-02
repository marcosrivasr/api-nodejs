exports.jsonResponse = function(statuscode, body){
    return {
        statuscode,
        body: body
    }
}