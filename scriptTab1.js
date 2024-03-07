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
    let timespanInMilliseconds = getDifferenceInMilliseconds(startDate, endDate);
    return convertDuration(timespanInMilliseconds, unit);
}