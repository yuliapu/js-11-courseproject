import { saveResultInStorage, getTableFromStorage } from "./storage.js";
import { DateInput } from "./dateInput.js";

// DOM variables
let form = document.querySelector("form");
let presets = document.getElementById("presets");
let startDateInput = document.getElementById("startDate");
let endDateInput = document.getElementById("endDate");
let resultsList = document.getElementById("results");
let unitRadio = document.querySelectorAll('input[name="unit"]');
let weekRadio = document.querySelectorAll('input[name="week"]');

const RESULTS_STORAGE_KEY = "results";

export function initDatesTab(){
    document.querySelector(".defaultopen").style.display = "block";
    let storedResults = getTableFromStorage(RESULTS_STORAGE_KEY);
    if (storedResults){
        storedResults.forEach(prependResultsList);
    }
}

function addDays(inputDate, days){
    let date = new Date(inputDate);
    return new Date(date.setDate(date.getDate() + days));
}

function validateDates(startDateInput, endDateInput){
    let startDate = new Date(startDateInput);
    let endDate = new Date(endDateInput);

    if (isNaN(startDate) || isNaN(endDate)){
        return false;
    }
    else if (startDate > endDate){
        return false;
    }
    return true;
}

function updateElementsState(isDisabled, ...elements){
    [...elements].forEach(i => i.disabled = isDisabled);
}

function getResultTextTemplate(result){
    let includingWeekdaysText = result.week === "All" ? "all days of week" : result.week.toLowerCase();
    let unit = Number(result.duration) > 1 ? result.unit : result.unit.substring(0, result.unit.length - 1);
    return `It takes ${result.duration} ${unit.toLowerCase()} from ${result.startDate} to ${result.endDate} (including ${includingWeekdaysText})`;
}

function prependResultsList(result){
    const li = document.createElement("li");
    li.textContent = getResultTextTemplate(result);
    resultsList.prepend(li);

    if (resultsList.children.length > 10){
        removeLastItemFromList(resultsList.children);
    }
}

function removeLastItemFromList(items){
    items[items.length - 1].remove();
}

function getCheckedValue(radio){
    return [...radio].find(i => i.checked).value
}

const handleSubmit = (event) => {
    event.preventDefault();
  
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    if (validateDates(startDate, endDate)){
        let dateInput = new DateInput(startDate, endDate, getCheckedValue(weekRadio), getCheckedValue(unitRadio))
        let result = dateInput.getProperties();

        prependResultsList(result);
        saveResultInStorage(RESULTS_STORAGE_KEY, result);
    }
    else {
        alert("Please provide valid start and end dates.");
        startDateInput.valueAsDate = new Date();
        endDateInput.valueAsDate = new Date();  
        endDateInput.min = startDateInput.value;
        updateElementsState(false, endDateInput, ...presets.children);
    }
  };
  
const handleStartDateChange = (event) => {
    updateElementsState(isNaN(new Date(startDateInput.value)), endDateInput, ...presets.children);
    if (!isNaN(new Date(endDateInput.value)) && !validateDates(startDateInput.value, endDateInput.value) ){
        endDateInput.value = startDateInput.value;
    }

    endDateInput.min = startDateInput.value;
};

const handleEndDateChange = (event) => {
    if(isNaN(new Date(endDateInput.value))){
        alert("Please provide valid end date.");
        endDateInput.value = startDateInput.value;
    }
    else {
        startDateInput.max = endDateInput.value;
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