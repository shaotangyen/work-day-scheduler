//24 hour format business hours
var taskListByHour = [
    { hour24f: "9", task: "" },
    { hour24f: "10", task: "" },
    { hour24f: "11", task: "" },
    { hour24f: "12", task: "" },
    { hour24f: "13", task: "" },
    { hour24f: "14", task: "" },
    { hour24f: "15", task: "" },
    { hour24f: "16", task: "" },
    { hour24f: "17", task: "" },
];
var taskListEl = $('.container');
var currentTime = moment().format("k"); //current hour string in 24h format: 1 2 ... 23 24
//var currentTime = "11"; //11AM for testing

function conver24hToAMPM(time) {
    return moment(time, "k").format("hA");
}

function converAMPMTo24h(time) {
    return moment(time, "hA").format("k");
}

// For pressing Enter on the textarea
function handleSaveByEnter(event) {
    if (event.keyCode === 13) { //if pressed Enter
        event.preventDefault(); //prevent new line
        handleSave(event);
    } else if( //any printable change or space/backspace/delete
        (event.keyCode > 47 && event.keyCode < 58)   || // number keys
        event.keyCode == 32 || event.keyCode == 8 || event.keyCode == 46 ||// spacebar, backspace, delete
        (event.keyCode > 64 && event.keyCode < 91)   || // letter keys
        (event.keyCode > 95 && event.keyCode < 112)  || // numpad keys
        (event.keyCode > 185 && event.keyCode < 193) || // ;=,-./` (in order)
        (event.keyCode > 218 && event.keyCode < 223)
    ){
        $(event.target).parent().children(".save-btn").addClass("btn-dark fas fa-save");
    }
}

function handleSave(event) {
    //getting the textarea's value
    var contentText = $(event.target).parent().children(".content").val();
    var saveBtn = $(event.target).parent().children(".save-btn");
    //save it into the array and localstorage
    var index = converAMPMTo24h($(event.target).parent().children(".time").text());
    for (i = 0; i < taskListByHour.length; i++) {
        if (index === taskListByHour[i].hour24f) {
            taskListByHour[i].task = contentText; //save the text into array
            localStorage.setItem("task-list", JSON.stringify(taskListByHour)); //save to localstorage
            //update icon
            saveBtn.removeClass("btn-dark fas fa-save");
            saveBtn.addClass("btn-secondary fas fa-check");
            break;
        }
    }
}

function renderTablePerRowByTime(timeText, taskText) {
    var taskRow = $('<div class="row">');
    var taskTime = $('<div class="time col-2 table-bordered bg-light d-flex align-items-center justify-content-center">');
    var taskContent = $('<textarea class="content col-9 row-auto table-bordered" placeholder="Enter your task here">'); //test out input; 
    var taskSaveBtn = $('<button class="save-btn col-1 btn btn-secondary d-flex align-items-center justify-content-center fas fa-check">');
    var displayTimeText = conver24hToAMPM(timeText);
    taskTime.text(displayTimeText);
    taskRow.append(taskTime);
    if (taskText !== "") { // if local stored task is not empty, set it to the textarea
        taskContent.val(taskText);
    }
    taskRow.append(taskContent);
    taskRow.append(taskSaveBtn);
    taskListEl.append(taskRow);

    //Change row color by time
    var currentTimeInt = parseInt(currentTime); //getting to hour # of NOW, make it an int
    var scheduleTime = parseInt(timeText); //converting the 24h format to an int

    //console.log("scheduleTime: "+scheduleTime+", now: "+now);
    if (scheduleTime > currentTimeInt) { //future
        taskContent.css("background-color", "white");
    } else if (scheduleTime == currentTimeInt) { //now
        taskContent.css("background-color", "#fe994f");
        taskContent.css("font-weight", "bold");
    } else if (scheduleTime < currentTimeInt) { //past
        taskContent.css("background-color", "#e5e1dd");
    }

}

function init() {
    var storedList = JSON.parse(localStorage.getItem("task-list"));
    if (storedList !== null) {
        taskListByHour = storedList;
    }

    $("#currentDay").text(moment().format("dddd, Do MMM, YYYY"));
    for (i = 0; i < taskListByHour.length; i++) {
        renderTablePerRowByTime(taskListByHour[i].hour24f, taskListByHour[i].task);
    }

}

init();

taskListEl.on('click', '.save-btn', handleSave);
taskListEl.on('keydown', '.content', handleSaveByEnter);