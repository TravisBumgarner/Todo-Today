import React from 'react'

import { BigBoxOfNothing, Button, DropdownMenu, Table } from 'sharedComponents'
import { formatDateDisplayString, projectStatusLookup, sumArray } from 'utilities'
import { context } from "Context"
import moment, { Moment } from 'moment'


// const FAKE_DATA = [
//     {
//         projectId: "foo",
//         projectTitle: "Acme",
//         dates: {
//             "2022-04-24": 1,
//             "2022-04-25": 2,
//             "2022-04-26": 3,
//             "2022-04-27": 4,
//             "2022-04-28": 5
//         }
//     }
// ]

type ReportTableProps = {
    crunchedNumbers: Record<string, Record<string, number>>
    startDate: Moment,
    endDate: Moment
}



const ReportsTable = ({crunchedNumbers, startDate, endDate}: ReportTableProps) => {
    const { dispatch, state } = React.useContext(context)
    // if(true){
    //     return <BigBoxOfNothing message="Create a report!" />
    // }

    const dateColumns: string[] = []
    for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
        dateColumns.push(m.format('YYYY-MM-DD'));
      }

    const getDuration = (crunchedNumbers: Record<string, Record<string, number>>, date: string, projectId: string) => {
        if(date in crunchedNumbers && projectId in crunchedNumbers[date]){
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
                        <Table.TableHeaderCell  scope="col">Total</Table.TableHeaderCell>
                        <Table.TableHeaderCell style={{textAlign: 'center'}} colSpan={dateColumns.length + 1} scope="col">Daily Breakdown</Table.TableHeaderCell>
                    </Table.TableRow>
                    <Table.TableRow>
                    <Table.TableHeaderCell scope="col"></Table.TableHeaderCell>
                        <Table.TableHeaderCell width="40%" scope="col"></Table.TableHeaderCell>
                        {
                            dateColumns.map(date => <Table.TableHeaderCell width="10%" scope="col">{date}</Table.TableHeaderCell>)
                        }
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {Object.keys(state.projects).map(projectId => {
                        return (
                            <Table.TableRow>
                                <Table.TableBodyCell>{state.projects[projectId].title}</Table.TableBodyCell>
                                <Table.TableBodyCell>total</Table.TableBodyCell>
                                {
                                    dateColumns.map(date => <Table.TableBodyCell>{getDuration(crunchedNumbers, date, projectId)}</Table.TableBodyCell>)
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