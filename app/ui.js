let document = require("document");

export function GetThereUI() {
  this.timeValue = document.getElementById("timeValue");
  this.timeLabel = document.getElementById("timeLabel");
  this.destinationsList = document.getElementById("destinationsList");
  this.statusText = document.getElementById("status");
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
  
  if(destinations.status) {
    this.timeValue.text = destinations.time.toFixed(0);
    this.timeLabel.text = "mins";
  } else {
    this.timeValue.text = "--";
    this.timeLabel.text = "";    
  }

}

