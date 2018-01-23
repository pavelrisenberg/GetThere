var document = require("document");
import * as messaging from "messaging";
import * as util from "../common/utils";
import { me } from "appbit";
import { GetThereUI } from "./ui.js";

console.log("Get There starting!");

var ui = new GetThereUI();

setInterval(function() {
  if(messaging.peerSocket.OPEN) {
    ui.updateUI("disconnected");
  }
}, 1000);

// Connected?
setInterval(function() {
  console.log("Get There App (" + me.buildId + "): app connection=" + messaging.peerSocket.readyState + 
              " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
}, 3000);

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  console.log("Socket opened (app)");
  ui.updateUI("loading");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  console.log("Received message (app)!");
  ui.updateUI("loaded", evt.data);
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  console.log("Connection error (app): " + err.code + " - " + err.message);
  ui.updateUI("error");
}

