import { DESTINATIONS_COUNT } from "../common/globals.js";

let document = require("document");

export function GetThereUI() {
  this.destinationsList = document.getElementById("destinationsList");
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
    this.destinationsList.style.display = "inline";
    this.statusText.text = "";

    this.updateDestinationsList(destinations);
  } else {
    this.destinationsList.style.display = "none";

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
      let time = destinations.destinationData[i].time.toFixed(0);
      // Detecting if I'm around with some gaps
      if (time > 0) {
        tile.getElementById("duration").text = destinations.destinationData[i].time.toFixed(0);        
      }
    } else {
      tile.getElementById("duration").text = "--";
    }
    
  }
  
}

