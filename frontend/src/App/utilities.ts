import moment from 'moment'

const lookupByDate = (key: moment.Moment) => {
    return key.format('YYYY-MM-DD')
}

const areDatesEqual = (a: moment.Moment, b: moment.Moment) => {
    return lookupByDate(a) === lookupByDate(b)
}

export {
    lookupByDate,
    areDatesEqual
}