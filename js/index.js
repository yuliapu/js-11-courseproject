"use strict"

const TAB_STORAGE_KEY = "tab";

let tablinks = document.querySelector(".tab");
let tabcontent = document.getElementsByClassName("tabcontent");
let defaultOpen = document.querySelector(".defaultopen");

function init(){
    let savedTab = getSelectedTabFromStorage();
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
    saveSelectedTabInStorage(evt.target.id)
  }


function saveSelectedTabInStorage(name){
    localStorage.setItem(TAB_STORAGE_KEY, name);
}

const getSelectedTabFromStorage = () => localStorage.getItem(TAB_STORAGE_KEY);



tablinks.addEventListener("click", handleTabLinkClick);
init();