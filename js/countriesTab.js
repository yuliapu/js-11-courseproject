"use strict"

const countrySelect = document.getElementById("country");
const yearSelect = document.getElementById("year");
const holidaysTable = document.querySelector("#holidays-by-country tbody");

const API_KEY = "fxcnzLXzTU4yKyPFdzcGK85cIxlJtJzH";

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
    holidaysTable.innerHTML = "";
    holidays.forEach(holiday => {
        let responseDate = holiday.date.datetime;
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

function init(){
    populateCountries();
    populateYears(2001, 2049);
}

countrySelect.addEventListener("change", handleCountrySelection);
yearSelect.addEventListener("change", handleYearSelection);

init();
