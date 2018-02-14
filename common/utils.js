// Remove all quotation marks from a string
export function stripQuotes(str) {
  return str ? str.replace(/"/g, "") : "";
}

// Number with 1,000 commas
export function numberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get current time in HH:MM format 
export function getFormattedCurrentTime(timeSystem) {
  let currentTime = new Date();
  return getFormattedTime(currentTime, timeSystem, false);
}

// Get time in HH:MM format 
export function getFormattedTime(time, timeSystem, ampmNotation = true) {
  if(timeSystem) {
    var hours = time.getHours();
    var minutes = time.getMinutes();
    if(ampmNotation) {
      var ampm = hours >= 12 ? 'pm' : 'am';
    } else {
      var ampm = hours >= 12 ? 'p' : 'a';
    }
    hours = hours % 12;
    hours = hours ? hours : 12;
    return (('0' + hours).slice(-2)) + ":" + (('0' + minutes).slice(-2)) + ampm;
  } else {
    return (('0' + time.getHours()).slice(-2)) + ":" + (('0' + time.getMinutes()).slice(-2));    
  }
}

// Add minutes to Date
export function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

// Get current time + minutes
export function getTimeAtDestination(minutes, timeSystem) {
  let currentTime = new Date();
  return getFormattedTime(addMinutes(currentTime, minutes), timeSystem)
}

// Get X h Y min from minute
export function getFormattedDuration(minutes) {
  if(minutes >= 600) {
    return ">" + Math.floor(minutes / 60).toFixed(0) + "h";
  } else if(minutes >= 60) {
    return Math.floor(minutes / 60).toFixed(0) + "h" + Math.round(minutes % 60).toFixed(0) + "min";
  } else {
    return Math.round(minutes.toFixed(0)) + "min";
  }
}