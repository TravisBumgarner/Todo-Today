import styled from 'styled-components'

import { TColor } from 'sharedTypes'

const Table = styled.table`
    margin: 1rem 0;
    padding: 1rem;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border: 2px solid ${({ theme }) => theme.INTERACTION};
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
        background-color: ${({ theme }) => theme.BACKGROUND};   
    }

    &:nth-child(2n){
        background-color: ${({ theme }) => theme.BACKGROUND};   
    }
    
`

const TableHeaderCell = styled.th<{theme: TColor, width?: string, minWidth?: string}>`
    background-color: ${({ theme }) => theme.BACKGROUND};
    color: ${({ theme }) => theme.INTERACTION}; 
    border-bottom: 2px solid ${({ theme }) => theme.INTERACTION};
    padding: 10px;
    text-align: left;
    width: ${({ width }) => width};
    min-width: ${({ minWidth }) => minWidth};
    
`
const TableBodyCell = styled.td`
    border-bottom: 2px solid ${({ theme }) => theme.INTERACTION};
    padding: 10px;
    color: ${({ theme }) => theme.INTERACTION};
`

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableBodyCell
}
