import React from 'react'
import moment from 'moment'
import { useLiveQuery } from 'dexie-react-hooks'

import database from 'database'
import { Table } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup, formatDurationDisplayString, sumArray } from 'utilities'
import { TDateISODate, TProject } from 'sharedTypes'

type ReportTableProps = {
    crunchedNumbers: Record<string, Record<string, number>>
    startDate: TDateISODate,
    endDate: TDateISODate
}

const ReportsTable = ({ crunchedNumbers, startDate, endDate }: ReportTableProps) => {
    const projects = useLiveQuery(async () => {
        return database.projects.toArray()
    })
    const dateColumns: string[] = []
    for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
        dateColumns.push(formatDateKeyLookup(m))
    }
    
    if(!projects) return <p>One sec</p>
    const tableTitle = `${formatDateDisplayString(startDate)} to ${formatDateDisplayString(endDate)}`
    return (
        <>
            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell scope="col">Project</Table.TableHeaderCell>
                        <Table.TableHeaderCell scope="col">Total</Table.TableHeaderCell>
                        <Table.TableHeaderCell style={{ textAlign: 'center' }} colSpan={dateColumns.length + 1} scope="col">{tableTitle}</Table.TableHeaderCell>
                    </Table.TableRow>
                    <Table.TableRow>
                        <Table.TableHeaderCell scope="col"></Table.TableHeaderCell>
                        <Table.TableHeaderCell width="40%" scope="col"></Table.TableHeaderCell>
                        {
                            dateColumns.map(date => (
                                <Table.TableHeaderCell key={date} width="10%" scope="col">{date}</Table.TableHeaderCell>
                            ))
                        }
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {Object.keys(crunchedNumbers).map(projectId => {
                        const totalDuration = sumArray(Object.values(crunchedNumbers[projectId]))
                        const totalDurationDisplay = totalDuration ? formatDurationDisplayString(totalDuration) : '-'
                        return (
                            <Table.TableRow key={projectId}>
                                <Table.TableBodyCell>{((projects as TProject[]).find(({id}) => id === projectId)  as TProject).title}</Table.TableBodyCell>
                                <Table.TableBodyCell>{totalDurationDisplay}</Table.TableBodyCell>
                                {
                                    dateColumns.map(date => {
                                        const minutes = crunchedNumbers[projectId][date]
                                        return <Table.TableBodyCell key={date}>{minutes ? formatDurationDisplayString(minutes) : '-'}</Table.TableBodyCell>
                                    })
                                }
                            </Table.TableRow>
                        )
                    })}
                </Table.TableBody>
            </Table.Table>
        </>
    )
}

export default ReportsTable