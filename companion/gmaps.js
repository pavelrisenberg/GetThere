export function GoogleMapsAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    this.apiKey = "AIzaSyDwpJb0qv6FSEt-Yr_pC8Ge9kALg6x2wlg";
  }
};

GoogleMapsAPI.prototype.getRouteTiming = function(origin, destination, resultArray) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?";
    url += "&key=" + self.apiKey;
    url += "&mode=driving&units=metric";
    url += "&origins=" + origin;
    url += "&destinations=" + destination;
    console.log("Fetching URL: " + url);
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log("Got JSON response from server:" + JSON.stringify(json));

      for (let i = 0; i < json["rows"][0]["elements"].length; i++) {
        var duration = (Number.parseInt(json["rows"][0]["elements"][i]["duration"]["value"]) / 60);
        var distance = (Number.parseInt(json["rows"][0]["elements"][i]["distance"]["value"]));
        
        resultArray[i].duration = duration;
        resultArray[i].distance = distance;
      }

      resolve(resultArray);
    }).catch(function (error) {
      console.log("Fetching " + url + " failed: " + JSON.stringify(error));
      reject(resultArray);
    });
  });
}