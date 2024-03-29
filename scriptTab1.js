"use strict"

// DOM variables
let form = document.querySelector("form");
let startDateInput = document.getElementsById("startDate");
let endDateInput = document.getElementsById("endDate");

const RESULTS_STORAGE_KEY = "results";

// functions
function addDays(inputDate, days){
    let date = new Date(inputDate);
    return date.setDate(date.getDate() + days);
}

function convertDuration(timespanInMilliseconds, unit){
    let convertionMap = new Map([
        ["days", 24 * 60 * 60],
        ["hours", 60 * 60],
        ["minutes", 60],
        ["seconds", 1]]
    );
    return Math.ceil(timespanInMilliseconds / 1000 / convertionMap.get(unit));
}

function getDifferenceInMilliseconds(startDate, endDate){
    let startDate = new Date(startDate);
    let endDateIncluded = new Date(startDate).setDate(endDate.getDate() + 1);
    return Math.abs(endDate - startDate)
}

function getDifference(startDate, endDate, week, unit){
    let resultDurationInMilliseconds = 0;
    let totalDifference = getDifferenceInMilliseconds(startDate, endDate);

    switch (week){
        case "All": resultDuration = totalDifference; break;
        case "Weekdays": resultDuration = totalDifference - getWeekdaysCountInMilliseconds(startDate, endDate); break;
        case: "Weekends": resultDuration = getWeekdaysCountInMilliseconds(startDate, endDate); break;
    }
    
    return convertDuration(resultDurationInMilliseconds, unit);
}

function getWeekdaysCountInMilliseconds(startDate, endDate){
    let weekdaysCount = 0;
    const currDate = new Date(startDate);
    let isWeekend = (dayOfWeek) => (dayOfWeek === 6 || dayOfWeek === 0);
    while (currDate <= new Date(endDate)) {
        if (!isWeekend(currDate.getDay())){
            weekdaysCount++;
        }
       currDate.setDate(currDate.getDate() + 1);
    }

   return weekdaysCount * 24 * 60 * 60 * 1000;
}

function saveResultInStorage(startDate, endDate, difference, unit){
    let newResult = {
        start : startDate,
        end : endDate,
        difference : difference,
        unit : unit
    }

    let storedResults = JSON.parse(localStorage.getItem(RESULTS_STORAGE_KEY)) || [];
    storedResults.push(newResult);
    
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(storedResults));
}

const handleSubmit = (event) => {
    event.preventDefault();
  
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const unit = document.querySelector('input[name="unit"]:checked').value;
    const week = document.querySelector('input[name="week"]:checked').value;
    let difference = getDifference(startDate, endDate, week, unit);
  };
  
  
// Event listeners
bookForm.addEventListener("submit", handleSubmit);