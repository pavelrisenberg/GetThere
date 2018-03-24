import { DESTINATIONS_COUNT } from "../common/globals.js";
import { getFormattedCurrentTime, getFormattedDuration, getTimeAtDestination } from "../common/utils.js";
import { me as device } from "device";

// Detect default Ionic screen parameters for device not updated to Fitbit OS 2
if (!device.screen) device.screen = { width: 348, height: 250 };

let document = require("document");

export function GetThereUI() {
  this.destinationsScreen = document.getElementById("destinationsScreen");
  this.currentTimeText = document.getElementById("currentTimeText");
  this.statusText = document.getElementById("status");
  this.statusHeader = this.statusText.getElementById("header");
  this.statusCopy = this.statusText.getElementById("copy");
  
  this.timeSystem = false;
  
  this.tiles = [];
  for (var i = 0; i < DESTINATIONS_COUNT; i++) {
    var tile = document.getElementById(`destination-${i}`);
    if (tile) {
      this.tiles.push(tile);
    }
  }  
}


GetThereUI.prototype.updateUI = function(state, destinations) {

  if (state === "loaded") {
    if(destinations.status == 1) {
      this.destinationsScreen.style.display = "inline";
      this.statusText.style.display = "none";
      this.statusHeader.text = "";
      this.statusCopy.text = "";
      this.updateDestinationsList(destinations);      
    } else if(destinations.status == 2) {
      this.destinationsScreen.style.display = "none";
      this.statusText.style.display = "inline";      
      this.statusHeader.text = "Houston...";      
      this.statusCopy.text = "We have an API communication problem.";      
    } else if(destinations.status == 3) {
      this.destinationsScreen.style.display = "none";
      this.statusText.style.display = "inline";      
      this.statusHeader.text = "Houston...";      
      this.statusCopy.text = "Error acquiring location. You can run, but you can't hide!";
    }
  } else {
    this.destinationsScreen.style.display = "none";
    this.statusText.style.display = "inline";

    if (state === "loading") {
      this.statusHeader.text = "";      
      this.statusCopy.text = "Working on routes to destinations...";
    }
    else if (state === "disconnected") {
      this.statusHeader.text = "Houston...";      
      this.statusCopy.text = "We have a problem connecting to Fitbit App.";
    }
    else if (state === "error") {
      this.statusHeader.text = "Houston...";      
      this.statusCopy.text = "We have a problem connecting to Fitbit App.";
    }
  }
}

GetThereUI.prototype.updateClock = function(destinations) {
  this.currentTimeText.text = getFormattedCurrentTime(this.timeSystem);
}

GetThereUI.prototype.updateDestinationsList = function(destinations) {
  
  this.timeSystem = destinations.appSettings.timeSystem;
  this.updateClock();
  
  for (var i = 0, j = 0; i < DESTINATIONS_COUNT || j < DESTINATIONS_COUNT; i++, j++) {    
    var tile = this.tiles[j];
    if (!tile) {
      console.log("No tile for index: " + i);
      continue;
    }
    
    if (i >= destinations.destinationData.length) {
      tile.style.display = "none";
      continue;
    }
    
    tile.getElementById("error-image").style.display = "none";
    tile.getElementById("destination-name").text = destinations.destinationData[i].destination_name;

    if(destinations.status && destinations.destinationData[i].success) {
      // Rendering happy scenario
      var duration = destinations.destinationData[i].duration;
      var distance = destinations.destinationData[i].distance / 1000;
      // Detecting if I'm around location in question with <=1km duration
      if (distance > 1) {
        tile.style.display = "inline";
        tile.getElementById("duration").text = getFormattedDuration(duration, destinations.appSettings.timeSystem);
        if(!destinations.destinationData[i].trafficInfo) {
          tile.getElementById("duration").text += " *";          
        }
        if(destinations.appSettings.unitSystem) {
          tile.getElementById("distance").text = (distance * 0.62137119).toFixed(1);
          tile.getElementById("distanceLabel").text = "mi";          
        } else {
          tile.getElementById("distance").text = distance.toFixed(1);
          tile.getElementById("distanceLabel").text = "km";
        }
     
        if(distance <= 2) {
          tile.getElementById("arrival").text = "Get some steps?";
        } else {
          tile.getElementById("arrival").text =
            `Arriving at ${getTimeAtDestination(duration, destinations.appSettings.timeSystem)}`;
        }
        
      } else {
        tile.style.display = "none";
        j--;
      }
    } else {
      // errorCode possible values: 
      // * NOT_FOUND
      // * ZERO_RESULTS 
      // * MAX_ROUTE_LENGTH_EXCEEDED
      // * UNKNOWN
      tile.getElementById("duration").text = "";
      tile.getElementById("distance").text = "";
      tile.getElementById("distanceLabel").text = "";
      tile.getElementById("error-image").style.display = "inline";
      switch(destinations.destinationData[i].errorCode) {
        case "NOT_FOUND":
          tile.getElementById("arrival").text = "Address not found!";
          break;
        case "ZERO_RESULTS":
          tile.getElementById("arrival").text = "No route!";
          break;
        case "MAX_ROUTE_LENGTH_EXCEEDED":
          tile.getElementById("arrival").text = "Route too long!";
          break;
        case "UNKNOWN":
          tile.getElementById("arrival").text = "";
          break;
        default:
          tile.getElementById("arrival").text = "";
          break;
      }
    } 
  }
  
}

