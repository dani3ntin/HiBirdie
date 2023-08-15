
export function calculateDifferenceBetweenTwoDates(date1, date2){

    if(date1 === undefined || date2 === undefined)
        return -1
    const millisecondsInADay = 24 * 60 * 60 * 1000 
    const firstDate = new Date(date1)
    const secondDate = new Date(date2)

    const differenceInMilliseconds = Math.abs(secondDate - firstDate)
    const differenceInDays = Math.round(differenceInMilliseconds / millisecondsInADay)
    return differenceInDays
}

export function approximateNumberOfDays(days){
    if (days < 0)   return "Unknown data"
    if(days === 0)  return "Today"
    if(days === 1)  return "Yesterday"
    if(days < 7)    return days + " days ago"
    if(days === 7)  return "One week ago"
    if(days === 14) return "Two weeks ago"
    if(days === 21) return "Three weeks ago"
    if(days === 28) return "Four weeks ago"
    if(days === 30) return "One month ago"

    if(days < 30){
        const numberOfWeeks = Math.trunc(days / 7)
        if(numberOfWeeks === 1) return "More than one week ago"
        else return "More than " + numberOfWeeks + " weeks ago"
    }
    if(days < 365){
        const numberOfMonths = Math.trunc(days / 30)
        if(numberOfMonths === 1) return "More than one month ago"
        else return "More than " + numberOfMonths + " months ago"
    }
    return "Long time ago"
}