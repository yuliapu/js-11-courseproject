import { initDatesTab } from "./datesTab.js";
import { initCountriesTab } from "./countriesTab.js";
import { saveStringInStorage, getStringFromStorage } from "./storage.js";

const TAB_STORAGE_KEY = "tab";

const tablinks = document.querySelector(".tab");
const tabcontent = document.getElementsByClassName("tabcontent");
const defaultOpen = document.querySelector(".defaultopen");

function init(){
    initCountriesTab();
    initDatesTab();
    let savedTab = getStringFromStorage(TAB_STORAGE_KEY);
    if (!savedTab || savedTab === defaultOpen.id){
        defaultOpen.style.display = "block";
    }
    else{
        hideAllTabContents();
        setAllTabLinksInactive();
        showTab(savedTab);
        let tabLink = document.getElementById(savedTab);
        tabLink.className += " active";
    }
}

function hideAllTabContents(){
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
}

function setAllTabLinksInactive(){
    for (let i = 0; i < tablinks.children.length; i++) {
        tablinks.children[i].className = tablinks.children[i].className.replace(" active", "");
      }  
}

function showTab(id){
    document.querySelector(`.${id}`).style.display = "block";
}

function handleTabLinkClick(evt) {  
    hideAllTabContents();
    setAllTabLinksInactive();
    showTab(evt.target.id);
    console.log(evt.currentTarget)
    evt.target.className += " active";
    saveStringInStorage(TAB_STORAGE_KEY, evt.target.id)
  }

tablinks.addEventListener("click", handleTabLinkClick);

init();
