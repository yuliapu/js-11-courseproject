"use strict"

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
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    return Math.abs(endDate - startDate)
}

function getDifference(startDate, endDate, unit){
    let endDateIncluded = endDate.setDate(endDate.getDate() + 1);
    let timespanInMilliseconds = getDifferenceInMilliseconds(startDate, endDateIncluded);
    return convertDuration(timespanInMilliseconds, unit);
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


console.log(getWeekdaysCount(new Date("March 10, 2024"), new Date("March 17, 2024")));
console.log(getWeekdaysCount(new Date("March 1, 2024"), new Date("March 31, 2024")));
console.log(getWeekdaysCount(new Date("May 1, 2024"), new Date("May 31, 2024")));