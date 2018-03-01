import * as messaging from "messaging";
import clock  from "clock";
import { me } from "appbit";
import { display } from "display";
import { GetThereUI } from "./ui.js";

console.log("Get There starting...");

var ui = new GetThereUI();
var lastUpdateTime = new Date();

setTimeout(function() {
  if(!(messaging.peerSocket.readyState === messaging.peerSocket.OPEN)) {
    ui.updateUI("disconnected");
  }
}, 3000);


// Connected?
//setInterval(function() {
//  if (messaging.peerSocket.readyState != messaging.peerSocket.OPEN) {
//    console.log("Get There App (" + me.buildId + "): app connection=" + messaging.peerSocket.readyState + 
//                " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
//  }
//}, 3000);

// Clock updates when display is on
clock.granularity = "seconds";
clock.addEventListener("tick", function(clock, evt) {
  ui.updateClock();
  var currentTime = new Date();
  if(currentTime.getTime() - lastUpdateTime.getTime() > 60 * 1000){
  // Information update once a minute if display is on  
    if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        "message": "update"
      });
      lastUpdateTime = currentTime;
    }
  }
});



// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  console.log("Socket opened (app)");
  ui.updateUI("loading");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  console.log("Received message (app)!");
  ui.updateUI("loaded", evt.data);
  lastUpdateTime = new Date();  
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  console.log("Connection error (app): " + err.code + " - " + err.message);
  ui.updateUI("error");
}

