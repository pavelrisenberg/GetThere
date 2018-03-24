export function GoogleMapsAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    this.apiKey = "***REMOVED***";
  }
};

GoogleMapsAPI.prototype.getRouteTiming = function(origin, resultArray) {
  var self = this;
  
  var destinations = "";
  for (let i = 0; i < resultArray.length; i++) {
    if(i) {
      destinations += "|";
    }
    destinations += resultArray[i].address;
  }  
  return new Promise(function(resolve, reject) {
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?";
    url += "&key=" + self.apiKey;
    url += "&mode=driving&units=metric&departure_time=now&traffic_model=pessimistic";
    url += "&origins=" + origin;
    url += "&destinations=" + destinations;
    console.log("Fetching URL: " + url);
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));
      
      if(json["status"] == "OK") {
        for (let i = 0; i < json["rows"][0]["elements"].length; i++) {
          if(json["rows"][0]["elements"][i]["status"] == "OK") {
            if(json["rows"][0]["elements"][i]["duration_in_traffic"]["value"]) {
              var duration = (Number.parseInt(json["rows"][0]["elements"][i]["duration_in_traffic"]["value"]) / 60);
              var trafficInfo = true;
            } else {
              var duration = (Number.parseInt(json["rows"][0]["elements"][i]["duration"]["value"]) / 60);          
              var trafficInfo = false;
            }
            var distance = (Number.parseInt(json["rows"][0]["elements"][i]["distance"]["value"]));
        
            resultArray[i].duration = duration;
            resultArray[i].distance = distance;
            resultArray[i].trafficInfo = trafficInfo;     
            resultArray[i].success = true;                 
          } else {
            resultArray[i].success = false;
            switch(json["rows"][0]["elements"][i]["status"]) {
              case "NOT_FOUND":
                resultArray[i].errorCode = "NOT_FOUND";
                break;
              case "ZERO_RESULTS":
                resultArray[i].errorCode = "ZERO_RESULTS";
                break;
              case "MAX_ROUTE_LENGTH_EXCEEDED":
                resultArray[i].errorCode = "MAX_ROUTE_LENGTH_EXCEEDED";
                break;
              default:
                resultArray[i].errorCode = "UNKNOWN";
                break;
            }
          }
        }
        resolve(resultArray);
      } else {
        reject(resultArray);
      }

    }).catch(function (error) {
      console.log("Fetching " + url + " failed: " + JSON.stringify(error));
      reject(resultArray);
    });
  });
}