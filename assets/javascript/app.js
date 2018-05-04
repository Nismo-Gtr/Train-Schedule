$(document).ready(function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBya8G3Gl1xRbyIAS8iEiMOchgoqmqvRtc",
    authDomain: "train-schedule-a6302.firebaseapp.com",
    databaseURL: "https://train-schedule-a6302.firebaseio.com",
    projectId: "train-schedule-a6302",
    storageBucket: "train-schedule-a6302.appspot.com",
    messagingSenderId: "1087635175624"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


  database.ref().on("value", function (snapshot) {
    var data = snapshot.val();
    $("#trains").empty();

    var keys = Object.keys(data);

    for (var i = 0; i < keys.length; i++) {
        console.log(data[keys[i]]);
        var tr = $("<tr>");
        var trainName = $("<td>");
        var destination = $("<td>");
        var frequency = $("<td>"); 
        var nextArrival = $("<td>"); 
        var minutesAway = $("<td>");  
        trainName.text(data[keys[i]].name);
        destination.text(data[keys[i]].dest);
        frequency.text(data[keys[i]].freq);
        // add it to an element in the html
        $("#tBody").append(tr);
        $("#tBody").append(trainName);
        $("#tBody").append(destination);
        $("#tBody").append(frequency);
        $("#tBody").append(nextArrival);
        $("#tBody").append(minutesAway);
    }
});

$(document).on("click", ".delete-task", function () {
    var taskId = $(this).attr("data-task-id");
    database.ref().child(taskId).remove();
});

$("#addTrain").on("click", function () {
    var destination = $("#destination").val().trim();
    var trainName = $("#trainName").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = parseInt($("#frequency").val().trim());
    database.ref().push({
        dest: destination,
        name: trainName,
        first: firstTrain,
        freq: frequency
    });
    console.log($("#destination").val(""));
    console.log($("#trainName").val(""));
    console.log($("#firstTrain").val(""));  
    console.log($("#frequency").val(""));
});

// Adapt moment.js to create next arrival and minutes away
// I know I have all the pieces here but have just not been able to put it together in time



var tFrequency = database.ref("/freq/");
console.log(tFrequency);

// Time is 3:30 AM
var firstTime = "03:30";

var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);
// First Time (pushed back 1 year to make sure it comes before current time)

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

});
