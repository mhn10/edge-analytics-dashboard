function toLower (str) {
    if(str !== null) {
        return str.toLowerCase();
    }
    return str;
  }
module.exports = {toLower};

function capitalizeFirstLetter (str) {
    if(str === null){
        return str;
    }
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}
module.exports = {capitalizeFirstLetter};