import React from 'react'
import moment from 'moment'
import { useLiveQuery } from 'dexie-react-hooks'

import database from 'database'
import { Table } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup, formatDurationDisplayString, sumArray } from 'utilities'
import { TDateISODate, TProject } from 'sharedTypes'
import { context } from 'Context'

type ReportTableProps = {
    crunchedNumbers: Record<string, Record<string, number>>
    startDate: TDateISODate,
    endDate: TDateISODate
}

const sumAndDisplay = (durations: number[]) => {
    const totalDuration = sumArray(durations)
    const totalDurationDisplay = totalDuration ? formatDurationDisplayString(totalDuration) : '-'
    return totalDurationDisplay
}

const ReportsTable = ({ crunchedNumbers, startDate, endDate }: ReportTableProps) => {
    const { state: { dateFormat } } = React.useContext(context)
    const projects = useLiveQuery(async () => {
        return database.projects.toArray()
    })
    const dateColumns: string[] = []
    for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
        dateColumns.push(formatDateKeyLookup(m))
    }

    if (!projects) return <p>One sec</p>
    const tableTitle = `${formatDateDisplayString(dateFormat, startDate)} to ${formatDateDisplayString(dateFormat, endDate)}`
    return (
        <Table.Table>
            <Table.TableHeader>
                <Table.TableRow>
                    <Table.TableHeaderCell width="15%">Project</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="10%">Total</Table.TableHeaderCell>
                    <Table.TableHeaderCell
                        colSpan={dateColumns.length}
                        style={{ textAlign: 'center' }}
                        scope="col"
                    >
                        {tableTitle}
                    </Table.TableHeaderCell>
                </Table.TableRow>
                <Table.TableRow>
                    <Table.TableHeaderCell />
                    <Table.TableHeaderCell />
                    {
                        dateColumns.map((date) => (
                            <Table.TableHeaderCell key={date} scope="col">{date}</Table.TableHeaderCell>
                        ))
                    }
                </Table.TableRow>
            </Table.TableHeader>
            <Table.TableBody>
                {Object.keys(crunchedNumbers).map((projectId) => {
                    if (projectId === 'all') return

                    return (
                        <Table.TableRow key={projectId}>
                            <Table.TableBodyCell>
                                {((projects as TProject[]).find(({ id }) => id === projectId) as TProject).title}
                            </Table.TableBodyCell>
                            <Table.TableBodyCell>{sumAndDisplay(Object.values(crunchedNumbers[projectId]))}</Table.TableBodyCell>
                            {
                                dateColumns.map((date) => {
                                    const minutes = crunchedNumbers[projectId][date]
                                    return (
                                        <Table.TableBodyCell key={date}>{minutes ? formatDurationDisplayString(minutes) : '-'}</Table.TableBodyCell>
                                    )
                                })
                            }
                        </Table.TableRow>
                    )
                })}
                <Table.TableRow style={{ fontWeight: 900 }} key="all">
                    <Table.TableBodyCell>Summary</Table.TableBodyCell>
                    <Table.TableBodyCell>{sumAndDisplay(Object.values(crunchedNumbers.all))}</Table.TableBodyCell>
                    {
                        dateColumns.map((date) => {
                            const minutes = crunchedNumbers.all[date]
                            return <Table.TableBodyCell key={date}>{minutes ? formatDurationDisplayString(minutes) : '-'}</Table.TableBodyCell>
                        })
                    }
                </Table.TableRow>
            </Table.TableBody>
        </Table.Table>
    )
}

export default ReportsTable
