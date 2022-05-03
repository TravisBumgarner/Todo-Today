import React from 'react'

import {Table } from 'sharedComponents'
import { context } from "Context"
import moment, { Moment } from 'moment'

type ReportTableProps = {
    crunchedNumbers: Record<string, Record<string, number>>
    startDate: Moment,
    endDate: Moment
}

const ReportsTable = ({ crunchedNumbers, startDate, endDate }: ReportTableProps) => {
    const { dispatch, state } = React.useContext(context)
    const dateColumns: string[] = []
    for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
        dateColumns.push(m.format('YYYY-MM-DD'));
    }

    const getDuration = (crunchedNumbers: Record<string, Record<string, number>>, date: string, projectId: string) => {
        if (date in crunchedNumbers && projectId in crunchedNumbers[date]) {
            return crunchedNumbers[date][projectId]
        } else {
            return 0
        }
    }

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
                    {Object.keys(state.projects).map(projectId => {
                        return (
                            <Table.TableRow key={projectId}>
                                <Table.TableBodyCell>{state.projects[projectId].title}</Table.TableBodyCell>
                                <Table.TableBodyCell>total</Table.TableBodyCell>
                                {
                                    dateColumns.map(date => <Table.TableBodyCell key={date}>{getDuration(crunchedNumbers, date, projectId)}</Table.TableBodyCell>)
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