import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { geolocation } from "geolocation";
import { me } from "companion";

import { GoogleMapsAPI } from "./gmaps.js";
import { BingMapsAPI } from "./bingmaps.js";
import { DESTINATIONS_COUNT, DEFAULT_NAME, DEFAULT_ADDRESS } from "../common/globals.js";

console.log("Get There companion starting...");

var appSettings = {
  unitSystem: false,
  timeSystem: false
};

settingsStorage.onchange = function(evt) {
  console.log("Settings have changed...");
  readSettings();
  sendSchedule();
}

function readSettings() {
  appSettings.unitSystem = settingsStorage.getItem("unit_system") == "true";
  appSettings.timeSystem = settingsStorage.getItem("time_system") == "true";
}

// Connected?
//setInterval(function() {
//  if (messaging.peerSocket.readyState != messaging.peerSocket.OPEN) {
//    console.log("Get There App (" + me.buildId + "): companion connection=" + messaging.peerSocket.readyState + 
//                " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
//  }
//}, 3000);

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  console.log("Socket opened (companion)");
  readSettings();
  sendSchedule();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("Received message (companion)!");
  console.log(JSON.stringify(evt.data));
  if(evt.data.message == "update") {
    readSettings();
    sendSchedule();
  }
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

  var destinationsSettings = [];
  
  for (var i = 1; i <= DESTINATIONS_COUNT; i++){
    var destination_name = settingsStorage.getItem("destination_name" + i);
    var address = settingsStorage.getItem("address" + i);

    if (destination_name && address) {
      try {
        destination_name = JSON.parse(destination_name);
        address = JSON.parse(address);
      
        if (!address ||
            typeof(address) !== "object" || 
            !address.name ||
            !destination_name ||
            typeof(destination_name) !== "object" ||
            !destination_name.name
           ) {
          console.log("No settings found");
        } else {
          destination_name = destination_name.name;
          address = address.name;
          
          destinationsSettings.push({
            "destination_name": destination_name,
            "address": address,
          });
        }
      } catch (e) {
        console.log("Error parsing setting values: " + e);
      }
    }
  }

  if(!destinationsSettings.length) {
    console.log("No settings found overall - passing default settings");
    destinationsSettings.push({
      "destination_name": DEFAULT_NAME,
      "address": DEFAULT_ADDRESS
     });
  }
  
//  var googleMapsApi = new GoogleMapsAPI();
//  googleMapsApi.getRouteTiming(
  var bingMapsApi = new BingMapsAPI();
  bingMapsApi.getRouteTiming(
      position.coords.latitude + "," + position.coords.longitude, 
      destinationsSettings
      )
      .then(function(destinationData) {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          console.log("Sending data to clock: " + JSON.stringify(destinationData));
          messaging.peerSocket.send({
            "destinationData": destinationData,
            "appSettings": appSettings,
            "status": 1
          });
    
        }
      }, function(destinationData) {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          console.log("Sending data to clock: " + JSON.stringify(destinationData));
          messaging.peerSocket.send({
            "destinationData": destinationData, 
            "appSettings": appSettings,
            "status": 2
          });
        }
  }).catch(function (e) {
    console.log("Error: " + JSON.stringify(e));
    messaging.peerSocket.send({
      "destinationData": destinationData, 
      "appSettings": appSettings,
      "status": 2
    });
  });

}

function positionError(e) {
  console.log("Position error: " + JSON.stringify(e)); 
    messaging.peerSocket.send({
      "destinationData": null, 
      "appSettings": appSettings,
      "status": 3
    });
}