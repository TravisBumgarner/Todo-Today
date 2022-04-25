import moment from 'moment'
import { areDatesEqual, lookupByDate } from './utilities'

test('lookupByDate returns correct key', () => {
    const data = [
        { a: moment('2021-01-01'), expectedOutput: '2021-01-01' },
        { a: moment('2021-01-02'), expectedOutput: '2021-01-02' },
    ]

    data.forEach(({ a, expectedOutput }) => {
        expect(lookupByDate(a)).toBe(expectedOutput)
    })
})

test('areDatesEqual correctly compares dates', () => {
    const data = [
        { a: moment('2021-01-01'), b: moment('2021-01-01'), expectedOutput: true },
        { a: moment('2021-01-01'), b: moment('2021-01-02'), expectedOutput: false },
    ]

    data.forEach(({ a, b, expectedOutput }) => {
        expect(areDatesEqual(a, b)).toBe(expectedOutput)
    })
})