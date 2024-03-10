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
    endDate = endDate.setDate(endDate.getDate() + 1);
    let timespanInMilliseconds = getDifferenceInMilliseconds(startDate, endDate);
    return convertDuration(timespanInMilliseconds, unit);
}

function getWeekdaysCount(startDate, endDate){
   let startDayOfWeek = startDate.getDay();
   let endDayOfWeek = endDate.getDay();
   let weekdaysCount = 0;
   let daysFromStartDateToMonday = 0;
   let daysFromEndDateToSunday = 0;
   let totalDays = getDifference(startDate, endDate, "days");

   if (startDayOfWeek !== 1){
    daysFromStartDateToMonday = 7 - startDayOfWeek + 1;
    if (startDayOfWeek == 0){
     weekdaysCount++;
     daysFromStartDateToMonday = 1;
    }
    else {
     weekdaysCount += 2;
    }
   }
  
   if (endDayOfWeek !== 0){
    daysFromEndDateToSunday = endDayOfWeek;
   }

   totalDays = totalDays - daysFromStartDateToMonday - daysFromEndDateToSunday;
   weekdaysCount += totalDays / 7 * 2;

   return weekdaysCount;
}


console.log(getWeekdaysCount(new Date("March 10, 2024"), new Date("March 17, 2024")));
console.log(getWeekdaysCount(new Date("March 1, 2024"), new Date("March 31, 2024")));
console.log(getWeekdaysCount(new Date("May 1, 2024"), new Date("May 31, 2024")));