import styled from 'styled-components'

import { TColor } from 'sharedTypes'

const Table = styled.table`
    margin: 1rem 0;
    padding: 1rem;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border: 2px solid ${({ theme }) => theme.FOREGROUND_TEXT};
    table-layout: fixed;
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
        background-color: ${({ theme }) => theme.BACKGROUND_PRIMARY};   
    }

    &:nth-child(2n){
        background-color: ${({ theme }) => theme.BACKGROUND_PRIMARY};   
    }
    
`

const TableHeaderCell = styled.th<{theme: TColor, width?: string, minWidth?: string}>`
    background-color: ${({ theme }) => theme.BACKGROUND_PRIMARY};
    color: ${({ theme }) => theme.FOREGROUND_TEXT}; 
    border-bottom: 2px solid ${({ theme }) => theme.FOREGROUND_TEXT};
    padding: 10px;
    text-align: left;
    width: ${({ width }) => width};
    min-width: ${({ minWidth }) => minWidth};
    
`
const TableBodyCell = styled.td`
    border-bottom: 2px solid ${({ theme }) => theme.FOREGROUND_TEXT};
    padding: 10px;
    color: ${({ theme }) => theme.FOREGROUND_TEXT};
`

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableBodyCell
}
