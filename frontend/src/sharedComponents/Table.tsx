import styled from 'styled-components'

import colors from './colors'

const Table = styled.table`
    margin: 1rem 0;
    padding: 1rem;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border: 2px solid ${colors.PRIMARY}
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
        background-color: ${colors.SECONDARY};   
    }

    &:nth-child(2n){
        background-color: ${colors.SECONDARY};   
    }
    
`

const TableHeaderCell = styled.th`
    background-color: ${colors.SECONDARY};
    color: ${colors.PRIMARY}; 
    border-bottom: 2px solid ${colors.PRIMARY};
    padding: 10px;
    text-align: left;
    width: ${({ width }: { width: string }) => width};
    
`
const TableBodyCell = styled.td`
    border-bottom: 2px solid ${colors.PRIMARY};
    padding: 10px;
    color: ${colors.PRIMARY};
`

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableBodyCell
}
