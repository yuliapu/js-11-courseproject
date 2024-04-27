export class DateInput{
    constructor(startDate, endDate, week, unit){
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.week = week;
        this.unit = unit;
    }
    
    #convertDuration(timespanInMilliseconds){
        let convertionMap = new Map([
            ["Days", 24 * 60 * 60],
            ["Hours", 60 * 60],
            ["Minutes", 60],
            ["Seconds", 1]]
        );
        return Math.ceil(timespanInMilliseconds / 1000 / convertionMap.get(this.unit));
    }
    
    #getDifferenceInMilliseconds(){
        return Math.abs(this.endDate - this.startDate);
    }
    
    #isWeekend = (dayOfWeek) => (dayOfWeek === 6 || dayOfWeek === 0);

    #getWeekdaysCountInMilliseconds(){
        let weekdaysCount = 0;
        const currDate = new Date(this.startDate);
        while (currDate < this.endDate) {
            if (!this.#isWeekend(currDate.getDay())){
                weekdaysCount++;
            }
           currDate.setDate(currDate.getDate() + 1);
        }
    
       return weekdaysCount * 24 * 60 * 60 * 1000;
    }

    getDifference(){
        let resultDurationInMilliseconds = 0;
        if (this.startDate !== this.endDate){
            let totalDifference = this.#getDifferenceInMilliseconds();

            switch (this.week){
                case "All": resultDurationInMilliseconds = totalDifference; break;
                case "Weekdays": resultDurationInMilliseconds = this.#getWeekdaysCountInMilliseconds(); break;
                case "Weekends": resultDurationInMilliseconds = totalDifference - this.#getWeekdaysCountInMilliseconds(); break;
            }
        }
        return this.#convertDuration(resultDurationInMilliseconds);
    }

    getProperties(){
        let options = { year: 'numeric', month: 'long', day: 'numeric' };

        return {
            startDate: this.startDate.toLocaleDateString("en-US", options),
            endDate: this.endDate.toLocaleDateString("en-US", options),
            duration: this.getDifference(),
            unit: this.unit,
            week: this.week
        }
    }
}