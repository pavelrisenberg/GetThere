// Remove all quotation marks from a string
export function stripQuotes(str) {
  return str ? str.replace(/"/g, "") : "";
}


// Number with 1,000 commas
export function numberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


// Get current time in HH:MM format 
export function getFormattedCurrentTime() {
  let currentTime = new Date();
  return getFormattedTime(currentTime);
}


// Get time in HH:MM format 
export function getFormattedTime(time) {
  return ('0' + time.getHours()).slice(-2) + ":" + ('0' + time.getMinutes()).slice(-2);
}

// Add minutes to Date
export function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

// Get current time + minutes
export function getTimeAtDestination(minutes) {
  let currentTime = new Date();
  return getFormattedTime(addMinutes(currentTime, minutes))
}


// Get X h Y min from minute
export function getFormattedDuration(minutes) {
  return 
    (minutes >= 60)?
      (minutes / 60).toFixed(0) + " h " + (minutes % 60).toFixed(0) + " min"
    :
      minutes.toFixed(0) + " min";
    
}