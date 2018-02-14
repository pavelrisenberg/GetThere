import { DESTINATIONS_COUNT } from "../common/globals.js";
import { getFormattedCurrentTime, getFormattedDuration, getTimeAtDestination } from "../common/utils.js";

let document = require("document");

export function GetThereUI() {
  this.destinationsScreen = document.getElementById("destinationsScreen");
  this.currentTimeText = document.getElementById("currentTimeText");
  this.statusText = document.getElementById("status");
  this.statusHeader = this.statusText.getElementById("header");
  this.statusCopy = this.statusText.getElementById("copy");
  
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

GetThereUI.prototype.updateDestinationsList = function(destinations) {
  
  this.currentTimeText.text = getFormattedCurrentTime(destinations.appSettings.timeSystem);
  
  for (let i = 0; i < destinations.destinationData.length; i++) {    
    var tile = this.tiles[i];
    if (!tile) {
      console.log("no tile for index " + i);
      continue;
    }

    if (i >= destinations.destinationData.length) {
      tile.style.display = "none";
      continue;
    }
    
    tile.getElementById("error-image").style.display = "none";
    tile.style.display = "inline";    
    tile.getElementById("destination-name").text = destinations.destinationData[i].destination_name;

    if(destinations.status && destinations.destinationData[i].success) {
      // Rendering happy scenario
      var duration = destinations.destinationData[i].duration;
      var distance = destinations.destinationData[i].distance / 1000;
      // Detecting if I'm around location in question with <=1km duration
      if (distance > 1) {
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
          tile.getElementById("arrival").text = "Better get some steps?";
        } else {
          tile.getElementById("arrival").text =
            `Arriving at ${getTimeAtDestination(duration, destinations.appSettings.timeSystem)}`;
        }
        
      } else {
        tile.style.display = "none";
      }
    } else {
      // errorCode possible values: 
      // * NOT_FOUND
      // * ZERO_RESULTS 
      // * MAX_ROUTE_LENGTH_EXCEEDED
      // * UNKNOWN
      tile.getElementById("duration").text = "--";
      tile.getElementById("distance").text = "";
      tile.getElementById("distanceLabel").text = "";
      tile.getElementById("error-image").style.display = "inline";
      switch(destinations.destinationData[i].errorCode) {
        case "NOT_FOUND":
          tile.getElementById("arrival").text = "Address not found!";
          break;
        case "ZERO_RESULTS":
          tile.getElementById("arrival").text = "No route found!";
          break;
        case "MAX_ROUTE_LENGTH_EXCEEDED":
          tile.getElementById("arrival").text = "Route is too long!";
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

