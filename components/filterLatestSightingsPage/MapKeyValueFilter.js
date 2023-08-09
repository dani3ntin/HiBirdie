export const maximumDaysOptions = [
    {key: '0', value: 'No days limitation'},
    {key: '1', value: 'One'},
    {key: '2', value: 'Two'},
    {key: '3', value: 'Three'},
    {key: '4', value: 'One week'},
    {key: '5', value: 'Two weeks'},
    {key: '6', value: 'Three weeks'},
    {key: '7', value: 'One month'},
    {key: '8', value: 'Two months'},
    {key: '9', value: 'Three months'},
    {key: '10', value: 'Six months'},
    {key: '11', value: 'Nine months'},
    {key: '12', value: 'One year'},
]

export const maximumDistanceOptions = [
    {key: '0', value: 'No distance limitation'},
    {key: '1', value: '1'},
    {key: '2', value: '2'},
    {key: '3', value: '3'},
    {key: '4', value: '4'},
    {key: '5', value: '10'},
    {key: '6', value: '15'},
    {key: '7', value: '20'},
    {key: '8', value: '30'},
    {key: '9', value: '40'},
    {key: '10', value: '50'},
    {key: '11', value: '100'},
    {key: '12', value: '150'},
    {key: '13', value: '200'},
    {key: '14', value: '500'},
]

export function getMaximumDaysOptionValueFromKey(key){
    const n = parseInt(key, 10)
    const selectedObject = maximumDaysOptions.find(option => parseInt(option.key) === n)
    return selectedObject || null
}

export function getMaximumDaysRealValueFromKey(key){
    if(key == 0) return 0
    if(key == 1) return 1
    if(key == 2) return 2
    if(key == 3) return 3
    if(key == 4) return 7
    if(key == 5) return 14
    if(key == 6) return 21
    if(key == 7) return 31
    if(key == 8) return 62
    if(key == 9) return 93
    if(key == 10) return 182
    if(key == 11) return 279
    if(key == 12) return 365
    return selectedObject || null
}

export function getMaximumDistanceOptionValueFromKey(key){
    const n = parseInt(key, 10)
    const selectedObject = maximumDistanceOptions.find(option => parseInt(option.key) === n)
    return selectedObject || null
}

export function getMaximumDistanceRealValueFromKey(key){
    const n = parseInt(key, 10)
    if(key == 0) return 0
    const selectedObject = maximumDistanceOptions.find(option => parseInt(option.key) === n)
    if(selectedObject === undefined) return null
    return selectedObject.value
}