import styled from 'styled-components'

import colors from './colors'

const Table = styled.table`
    margin: 1rem 0;
    padding: 1rem;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border: 2px solid ${colors.FOREGROUND_PRIMARY}
`

const TableHeader = styled.thead`
    font-weight: 700;
`

const TableBody = styled.tbody`
    font-weight: 100;
`

const TableRow = styled.tr`
    padding: 10px;

    &:nth-child(2n+1){
        background-color: ${colors.BACKGROUND_PRIMARY};   
    }

    &:nth-child(2n){
        background-color: ${colors.BACKGROUND_PRIMARY};   
    }
    
`

const TableHeaderCell = styled.th`
    background-color: ${colors.BACKGROUND_PRIMARY};
    color: ${colors.FOREGROUND_PRIMARY}; 
    border-bottom: 2px solid ${colors.FOREGROUND_PRIMARY};
    padding: 10px;
    text-align: left;
    width: ${({ width }: { width: string }) => width};
    
`
const TableBodyCell = styled.td`
    border-bottom: 2px solid ${colors.FOREGROUND_PRIMARY};
    padding: 10px;
    color: ${colors.FOREGROUND_PRIMARY};
`

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableBodyCell
}
