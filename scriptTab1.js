"use strict"

// DOM variables
let form = document.querySelector("form");
let presets = document.getElementById("presets");
let startDateInput = document.getElementById("startDate");
let endDateInput = document.getElementById("endDate");
let resultsList = document.getElementById("results");

const RESULTS_STORAGE_KEY = "results";

class DateInput{
    constructor(startDate, endDate, week, unit){
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.week = week;
        this.unit = unit;
    }
    
    #convertDuration(timespanInMilliseconds){
        let convertionMap = new Map([
            ["Days", 24 * 60 * 60],
            ["Hours", 60 * 60],
            ["Minutes", 60],
            ["Seconds", 1]]
        );
        return Math.ceil(timespanInMilliseconds / 1000 / convertionMap.get(this.unit));
    }
    
    #getDifferenceInMilliseconds(){
        return Math.abs(this.endDate - this.startDate);
    }
    
    #getWeekdaysCountInMilliseconds(){
        let weekdaysCount = 0;
        const currDate = new Date(this.startDate);
        let isWeekend = (dayOfWeek) => (dayOfWeek === 6 || dayOfWeek === 0);
        while (currDate < this.endDate) {
            if (!isWeekend(currDate.getDay())){
                weekdaysCount++;
            }
           currDate.setDate(currDate.getDate() + 1);
        }
    
       return weekdaysCount * 24 * 60 * 60 * 1000;
    }

    getDifference(){
        let resultDurationInMilliseconds = 0;
        if (this.startDate !== this.endDate){
            let totalDifference = this.#getDifferenceInMilliseconds();

            switch (this.week){
                case "All": resultDurationInMilliseconds = totalDifference; break;
                case "Weekdays": resultDurationInMilliseconds = this.#getWeekdaysCountInMilliseconds(); break;
                case "Weekends": resultDurationInMilliseconds = totalDifference - this.#getWeekdaysCountInMilliseconds(); break;
            }
        }
        return this.#convertDuration(resultDurationInMilliseconds);
    }

    getProperties(){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };

        return {
            startDate: this.startDate.toLocaleDateString("en-US", options),
            endDate: this.endDate.toLocaleDateString("en-US", options),
            duration: this.getDifference(),
            unit: this.unit,
            week: this.week
        }
    }
}

// functions

function init(){
    getResultsFromStorage().forEach(prependResultsList);
}

function addDays(inputDate, days){
    let date = new Date(inputDate);
    return new Date(date.setDate(date.getDate() + days));
}

function saveResultInStorage(dateInput){
    let storedResults = getResultsFromStorage();
    storedResults.push(dateInput);
    
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(storedResults));
}

const getResultsFromStorage = () => JSON.parse(localStorage.getItem(RESULTS_STORAGE_KEY)) || [];

function validateDates(startDateInput, endDateInput){
    let startDate = new Date(startDateInput);
    let endDate = new Date(endDateInput);

    if (isNaN(startDate) || isNaN(endDate)){
        return false;
    }
    else if (startDate > endDate){
        return false
    }
    return true;
}

function updateElementsState(isDisabled, ...elements){
    [...elements].forEach(i => i.disabled = isDisabled);
}

function getResultTextTemplate(result){
    let includingWeekdaysText = result.week === "All" ? "all days of week" : result.week.toLowerCase();
    let unit = Number(result.duration) > 1 ? result.unit : result.unit.substring(0, result.unit.length - 1);
    return `It takes ${result.duration} ${unit.toLowerCase()} from ${result.startDate} to ${result.endDate}`
        +` (including ${includingWeekdaysText})`;
}

function prependResultsList(result){
    const li = document.createElement("li");
    li.textContent = getResultTextTemplate(result);
    resultsList.prepend(li);

    if (resultsList.children.length > 10){
        removeLastItemFromList(...resultsList.children);
    }
}

function removeLastItemFromList(...items){
    [...items][resultsList.children.length - 1].remove();
}

const handleSubmit = (event) => {
    event.preventDefault();
  
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const unit = document.querySelector('input[name="unit"]:checked').value;
    const week = document.querySelector('input[name="week"]:checked').value;

    if (validateDates(startDate, endDate)){
        let dateInput = new DateInput(startDate, endDate, week, unit)
        let result = dateInput.getProperties();

        prependResultsList(result);
        saveResultInStorage(result);
    }
    else {
        alert("Please provide valid start and end dates.");
        startDateInput.valueAsDate = new Date();
        endDateInput.valueAsDate = new Date();     
        updateElementsState(false, endDateInput, ...presets.children);
    }
  };
  
const handleStartDateChange = (event) => {
    updateElementsState(isNaN(new Date(startDateInput.value)), endDateInput, ...presets.children);
    
    if (!isNaN(new Date(endDateInput.value)) && !validateDates(startDateInput.value, endDateInput.value)){
        endDateInput.value = startDateInput.value;
    }
};

const handleEndDateChange = (event) => {
    if(!validateDates(startDateInput.value, endDateInput.value)){
        alert("Please provide valid end date.");
        endDateInput.value = startDateInput.value;
    }
};

const handlePresets = (event) => {
    endDateInput.valueAsDate = addDays(startDateInput.value, Number(event.target.dataset.value));
};

  
// Event listeners
form.addEventListener("submit", handleSubmit);
startDateInput.addEventListener("change", handleStartDateChange);
endDateInput.addEventListener("change", handleEndDateChange);
presets.addEventListener("click", handlePresets);

  
init();