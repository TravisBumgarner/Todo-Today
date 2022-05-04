import React from 'react'
import moment, { Moment } from 'moment'

import { Table } from 'sharedComponents'
import { formatDurationDisplayString, sumArray } from 'utilities'

type ReportTableProps = {
    crunchedNumbers: Record<string, Record<string, number>>
    startDate: Moment,
    endDate: Moment
}

const ReportsTable = ({ crunchedNumbers, startDate, endDate }: ReportTableProps) => {
    const dateColumns: string[] = []
    for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
        dateColumns.push(m.format('YYYY-MM-DD'));
    }
    console.log(crunchedNumbers)
    return (
        <>
            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell scope="col">Project</Table.TableHeaderCell>
                        <Table.TableHeaderCell scope="col">Total</Table.TableHeaderCell>
                        <Table.TableHeaderCell style={{ textAlign: 'center' }} colSpan={dateColumns.length + 1} scope="col">Daily Breakdown</Table.TableHeaderCell>
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
                                <Table.TableBodyCell>{projectId}</Table.TableBodyCell>
                                <Table.TableBodyCell>{totalDurationDisplay}</Table.TableBodyCell>
                                {
                                    dateColumns.map(date => {
                                        const minutes = crunchedNumbers[projectId][date]
                                        return <Table.TableBodyCell>{minutes ? formatDurationDisplayString(minutes) : '-'}</Table.TableBodyCell>
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