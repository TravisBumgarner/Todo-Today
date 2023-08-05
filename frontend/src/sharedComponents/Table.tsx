import styled from 'styled-components'
import { transparentize } from 'polished'

import { type TColor } from 'sharedTypes'

const Table = styled.table`
    margin: 1.5rem 0;
    padding: 1rem;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    table-layout: fixed;
    background-color: ${({ theme }) => transparentize(0.9, theme.INTERACTION)};
`

const TableHeader = styled.thead`
    font-weight: 700;
`

const TableBody = styled.tbody`
    font-weight: 100;
`

const TableRow = styled.tr`
    padding: 10px;
`

const TableHeaderCell = styled.th<{ theme: TColor, width?: string, minWidth?: string }>`
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
    vertical-align: center;
`

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableBodyCell
}
