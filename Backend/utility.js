function toLower (str) {
    if(str !== null) {
        return str.toLowerCase();
    }
    return str;
  }

function capitalizeFirstLetter (str) {
    if(str === null){
        return str;
    }
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

function extractNameFromEmail(str){
    if(str === null){
        return str;
    }
    var nameParts = str.split("@");
    var name = nameParts.length==2 ? nameParts[0] : null;
    return name;
}
module.exports = {toLower, capitalizeFirstLetter, extractNameFromEmail};