import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { geolocation } from "geolocation";
import { me } from "companion";

import { GoogleMapsAPI } from "./gmaps.js";
import { LATITUDE_SETTING, LONGITUDE_SETTING, MOSCOW_LATITUDE, MOSCOW_LONGITUDE } from "../common/globals.js";

console.log("Get There companion started");

settingsStorage.onchange = function(evt) {
  console.log("Settings have changed! " + JSON.stringify(evt));
  sendSchedule();
}

// Connected?
setInterval(function() {
  console.log("Get There App (" + me.buildId + "): companion connection=" + messaging.peerSocket.readyState + 
              " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
}, 3000);

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  console.log("Socket opened (companion)");
  sendSchedule();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("Received message (companion)!");
  console.log(JSON.stringify(evt.data));
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error (companion): " + err.code + " - " + err.message);
}

function sendSchedule() {
  geolocation.getCurrentPosition(positionSuccess, undefined, {enableHighAccuracy: true, maximumAge: 5 * 60 * 1000, timeout: 1000 });
}

function positionSuccess(position) {
  let latitude = settingsStorage.getItem(LATITUDE_SETTING);
  let longitude = settingsStorage.getItem(LONGITUDE_SETTING);

  if (latitude && longitude) {
    try {
      latitude = JSON.parse(latitude);
      longitude = JSON.parse(longitude);
      
      if (!latitude ||
          typeof(latitude) !== "object" ||
          !longitude ||
          typeof(longitude) !== "object"
         ) {
        latitude = MOSCOW_LATITUDE;
        longitude = MOSCOW_LONGITUDE;
        console.log("No settings found - using default values");
      } else {
        latitude = latitude.name;
        longitude = longitude.name;
      }
    }
    catch (e) {
      console.log("Error parsing setting values: " + e);
    }
  }

  
  var googleMapsApi = new GoogleMapsAPI();
  googleMapsApi.getRouteTiming(
      position.coords.latitude + "," + position.coords.longitude, 
      latitude + "," + longitude)
      .then(function(time) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      console.log("Sending time: " + JSON.stringify(time));
      messaging.peerSocket.send({
        "time": time, 
        "status": 1
      });
    
    }
  }).catch(function (e) {
    console.log("error"); console.log(e);
    messaging.peerSocket.send({
      "time": undefined, 
      "status": 0
    });
  });

}

function positionError(position) {
  console.log("Position error"); 
    messaging.peerSocket.send({
      "time": undefined, 
      "status": 0
    });
}