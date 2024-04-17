"use strict"

const countrySelect = document.getElementById("country");
const yearSelect = document.getElementById("year");
const holidaysTable = document.querySelector("#holidays-by-country tbody");
const dateHeaderCell = document.getElementById("date-header");

const API_KEY = "fxcnzLXzTU4yKyPFdzcGK85cIxlJtJzH";
const HOLIDAYS_STORAGE_KEY = "holidays";

function saveTableInStorage(holidaysInput){
    localStorage.setItem(HOLIDAYS_STORAGE_KEY, JSON.stringify(storedResults));
}

 const getCountries = async () => {
    const response = await fetch(
      `https://calendarific.com/api/v2/countries?api_key=${API_KEY}`
    );
    const data = await response.json();
  
    if (!response.ok) {  
      throw new Error(`Something went wrong! Details: ${data.message}`);
    }
  
    return data.response.countries;
  };

  const getHolidays = async (countryCode, year) => {
    const response = await fetch(
      `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${countryCode}&year=${year}`
    );
    const data = await response.json();
  
    if (!response.ok) {  
      throw new Error(`Something went wrong! Details: ${data.message}`);
    }
  
    return data.response.holidays;
  };

function getYears(start, stop) {
    return Array.from(
        { length: (stop - start) + 1 },
        (value, index) => start + index
    );
}

const populateCountries = async (event) =>{
    const data = await getCountries();
    let countries = data.filter(i => i.country_name !== "Russia");
    countries.forEach(country => {
        const option = document.createElement("option");
        option.textContent = country.country_name;
        option.value = country["iso-3166"];
        countrySelect.append(option);
    });
}

function populateYears(start, stop){
    const years = getYears(start, stop);
    let currYear = new Date().getFullYear();

    years.forEach(year => {
        const option = document.createElement("option");
        option.textContent = year;
        option.value = year;
        option.selected = year == currYear;
        yearSelect.append(option);
    });
}

const populateHolidays = async (event) =>{
    const holidays = await getHolidays(countrySelect.value, yearSelect.value);
    const holidaysInput = {
        country: countrySelect.value,
        year: yearSelect.value,
        data: holidays.map((holiday) => ({ date: holiday.date.datetime, name: holiday.name })),
      };

    buildHolidaysTable(holidaysInput);
    saveTableInStorage(holidaysInput);
}

function buildHolidaysTable(holidays){
    holidaysTable.innerHTML = "";
    holidays.forEach(holiday => {
        let responseDate = holiday.date;
        let date = new Date(responseDate.year, responseDate.month, responseDate.day);       

        const row = document.createElement("tr");
        row.innerHTML = `<td>${date.toLocaleDateString()}</td><td>${holiday.name}</td>`;
        holidaysTable.append(row);
    });
}

function handleCountrySelection(event){
    if (countrySelect.value !== "default"){
        yearSelect.disabled = false;
        populateHolidays();
    }
    else{        
        yearSelect.disabled = true;
    }
}

function handleYearSelection(event){
    if (yearSelect.value !== "default"){
        populateHolidays(countrySelect.value, yearSelect.value);
    }
}

function handleSort(event){
    if(event.target.classList.includes("fa-sort"))
    {
        let sortIcon = event.target;
        if (sortIcon.classList.includes("asc")){
            sortHolidays("asc");
            sortIcon.className = sortIcon.className.replace("asc", "desc");
        }
        else{
            sortHolidays("desc");
            sortIcon.className = sortIcon.className.replace("desc", "asc");
        }
    }
}

function init(){
    populateCountries();
    populateYears(2001, 2049);
}

countrySelect.addEventListener("change", handleCountrySelection);
yearSelect.addEventListener("change", handleYearSelection);
dateHeaderCell.addEventListener("click", handleSort);

init();
