module.exports= getDate;

function getDate(){
  today= new Date();
  currentday= today.getDay();

var options={
  weekday:"long",
  day:"numeric",
  month:"long"
}
var day= today.toLocaleDateString("hi-IN",options);
  return day;
}
