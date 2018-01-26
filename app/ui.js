import { DESTINATIONS_COUNT } from "../common/globals.js";
import { getFormattedCurrentTime, getFormattedDuration, getTimeAtDestination } from "../common/utils.js";

let document = require("document");

export function GetThereUI() {
  this.destinationsScreen = document.getElementById("destinationsScreen");
  this.currentTimeText = document.getElementById("currentTimeText");
  this.statusText = document.getElementById("status");
  
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
      this.statusText.text = "";

      this.updateDestinationsList(destinations);      
    } else if(destinations.status == 2) {
      this.destinationsScreen.style.display = "none";
      this.statusText.style.display = "inline";
      
      this.statusText.text = "Error searching one or more addresses. Check them in app settings";      
    } else if(destinations.status == 3) {
      this.destinationsScreen.style.display = "none";
      this.statusText.style.display = "inline";
      
      this.statusText.text = "Error acquiring your GPS position";
    }
  } else {
    this.destinationsScreen.style.display = "none";
    this.statusText.style.display = "inline";

    if (state === "loading") {
      this.statusText.text = "Loading times to destinations ...";
    }
    else if (state === "disconnected") {
      this.statusText.text = "Please check connection to phone and Fitbit App";
    }
    else if (state === "error") {
      this.statusText.text = "Connection error";
    }
  }
}

GetThereUI.prototype.updateDestinationsList = function(destinations) {
  
  this.currentTimeText.text = getFormattedCurrentTime();
  
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
    
    tile.style.display = "inline";
    
    tile.getElementById("destination-name").text = destinations.destinationData[i].destination_name;
    if(destinations.status) {
      // Rendering happy scenario
      var duration = destinations.destinationData[i].duration;
      var distance = destinations.destinationData[i].distance / 1000;
      // Detecting if I'm around location in question with <=1km duration
      if (distance > 1) {
        tile.getElementById("duration").text = getFormattedDuration(duration);
        tile.getElementById("distance").text = distance.toFixed(1);
        tile.getElementById("distanceLabel").text = "km";
        tile.getElementById("arrival").text =
          `Arriving at ${getTimeAtDestination(duration)}`;
      } else {
        tile.style.display = "none";
      }
    } else {
      tile.getElementById("duration").text = "--";
      tile.getElementById("distance").text = "";
      tile.getElementById("distanceLabel").text = "";
      tile.getElementById("arrival").text = "";
    }
    
  }
  
}

