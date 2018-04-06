export function BingMapsAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    this.apiKey = "<your key>";
  }
};

// Bing Maps API Geocoder: http://dev.virtualearth.net/REST/v1/Locations?query=&userLocation=&maxResults=1&key=AuqMWUD2CSN12TGQ3MzqzdeFeFm_lZh5vkLuxcFEdesUil8tWwPjjKmpPVdkxr28

BingMapsAPI.prototype.getRouteTiming = function(origin, resultArray) {
  var self = this;
  
  var destinations = "";
  for (let i = 0; i < resultArray.length; i++) {
    if(i) {
      destinations += ";";
    }
    destinations += resultArray[i].address;
  }  
  
  return new Promise(function(resolve, reject) {
    // https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=lat0,long0;lat1,lon1;latM,lonM&destinations=lat0,lon0;lat1,lon1;latN,longN&travelMode=travelMode&startTime=startTime&timeUnit=timeUnit&key=BingMapsKey
    var currentTime = new Date();
    var url = "https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?";
    url += "&key=" + self.apiKey;
    url += "&travelMode=driving&timeUnit=second&distanceUnit=km&startTime=" + currentTime.toISOString();       url += "&origins=" + origin;
    url += "&destinations=" + destinations;
    console.log("Fetching URL: " + url);
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log("Got JSON response from server:" + JSON.stringify(json));
      
      if(json["statusCode"] == 200 && json["statusDescription"] == "OK") {
        for (let i = 0; i < json["resourceSets"][0]["resources"][0]["results"].length; i++) {
          if(!json["resourceSets"][0]["resources"][0]["results"][i]["hasError"] &&
            json["resourceSets"][0]["resources"][0]["results"][i]["travelDuration"] > 0
            ) { 
            var duration = (Number.parseInt(json["resourceSets"][0]["resources"][0]["results"][i]["travelDuration"]) / 60);
            var trafficInfo = true;
            var distance = (Number.parseInt(json["resourceSets"][0]["resources"][0]["results"][i]["travelDistance"] * 1000));
        
            resultArray[i].duration = duration;
            resultArray[i].distance = distance;
            resultArray[i].trafficInfo = trafficInfo;     
            resultArray[i].success = true;                 
          } else {
            resultArray[i].success = false;
            resultArray[i].errorCode = "ZERO_RESULTS";
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