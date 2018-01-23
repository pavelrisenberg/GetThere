export function GoogleMapsAPI(apiKey) {
  if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    this.apiKey = "AIzaSyDwpJb0qv6FSEt-Yr_pC8Ge9kALg6x2wlg";
  }
};

GoogleMapsAPI.prototype.getRouteTiming = function(origin, destination) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?";
    url += "&key=" + self.apiKey;
    url += "&mode=driving&units=metric";
    url += "&origins=" + origin;
    url += "&destinations=" + destination;
    fetch(url).then(function(response) {
      console.log("Got response from server:", response);
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));

      var time = (Number.parseInt(json["rows"][0]["elements"][0]["duration"]["value"]) / 60);

      resolve(time);
    }).catch(function (error) {
      console.log("Fetching " + url + " failed: " + JSON.stringify(error));
      reject(error);
    });
  });
}