//Convert a String to First char capital and rest lower
import _ from "lodash";

export const capitalizeFirstLetter = (str) => {
    if(str === null){
        return str;
    }
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

export const indianDateFormat = (str) => {
    if(str === null){
        return str;
    }
    var str1 = new Date(str);
    var dd = str1.getDate()+1;
    var mm = str1.getMonth()+1;
    var yyyy = str1.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    }
    str1 = dd+'/'+mm+'/'+yyyy;
    return str1;
}

export const usaDateFormat = (str) => {
    if(str === null){
        return str;
    }
    var str1 = new Date(str);
    var dd = str1.getDate()+1;
    var mm = str1.getMonth()+1;
    var yyyy = str1.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    }
    str1 = mm+'/'+dd+'/'+yyyy;
    return str1;
}

export const userProfileDateFormat = (str) => {
    if(str === null){
        return str;
    }
    var str1 = new Date(str);
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    
    var day = str1.getDate();
    var monthIndex = str1.getMonth();
    var year = str1.getFullYear();
    if(day<10) 
    {
        day='0'+day;
    } 
    str1 = monthNames[monthIndex] + ' ' + day + ',' + ' ' + year;
    // day + ' ' + monthNames[monthIndex] + ' ' + year;
    return str1;
    
}

export function paginate(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize;
    return _(items)
      .slice(startIndex)
      .take(pageSize)
      .value();
  }

export function extractNameFromEmail(str){
    if(str === null){
        return str;
    }
    var nameParts = str.split("@");
    var name = nameParts.length==2 ? nameParts[0] : null;
    return name;
}

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	//To be put in the UI for Dashboard
	// await navigator.geolocation.getCurrentPosition((loc) => {
	// 	lat1 = loc.coords.latitude;
	// 	lon1 = loc.coords.longitude;
	// 	console.log('The location in lat lon format is: [', loc.coords.latitude, ',', loc.coords.longitude, ']');
	//   })
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
	  Math.sin(dLat/2) * Math.sin(dLat/2) +
	  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	  Math.sin(dLon/2) * Math.sin(dLon/2)
	  ; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
  }
  
  function deg2rad(deg) {
	return deg * (Math.PI/180)
  }

  export function getAddress (latitude, longitude) {
    return new Promise(function (resolve, reject) {
		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var request = new XMLHttpRequest();
		var method = 'GET';
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&&key=AIzaSyC7hT-UUlRhQnDmDMzNRGPbKgJXU3OqQmk';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var data = JSON.parse(request.responseText);
					var address = data.results[0];
                    resolve(address.formatted_address);
                }
                else {
                    reject(request.status);
                }
            }
        };
        request.send();
    });
};