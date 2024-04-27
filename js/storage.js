export function saveTableInStorage(key, holidaysInput){
    localStorage.setItem(key, JSON.stringify(holidaysInput));
}

export const getTableFromStorage = (key) => JSON.parse(localStorage.getItem(key));

export function saveResultInStorage(key, dateInput){
    console.log()
    let storedResults = getTableFromStorage(key) || [];
    storedResults.push(dateInput);
    
    localStorage.setItem(key, JSON.stringify(storedResults));
}

export function saveStringInStorage(key, name){
    localStorage.setItem(key, name);
}

export const getStringFromStorage = (key) => localStorage.getItem(key);