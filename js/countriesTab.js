"use strict"

const countrySelect = document.getElementById("country");
const yearSelect = document.getElementById("year");

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
        option.value = country.uuid;
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

function handleCountrySelection(event){
    yearSelect.disabled = countrySelect.value === "default";
}

function init(){
    populateCountries();
    populateYears(2001, 2049);
}

countrySelect.addEventListener("change", handleCountrySelection);

init();
