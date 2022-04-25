import styled from 'styled-components'

import colors from './colors'

const Table = styled.table`
    padding: 1rem;
    border-collapse: collapse;
    border-radius: 1em;
    border-collapse: separate;
    border-spacing: 0;
    background-color: ${colors.PRIMARY.lightest};   
    width: 100%;
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
        background-color: ${colors.PRIMARY.lightest};   
    }

    &:nth-child(2n){
        background-color: ${colors.PRIMARY.lighten};   
    }
    
`

const TableHeaderCell = styled.th`
    background-color: ${colors.PRIMARY.lighten};
    color: ${colors.PRIMARY.darkest}; 
    padding: 10px;
    text-align: left;
    width: ${({ width }: { width: string }) => width};
    
`
const TableBodyCell = styled.td`
    padding: 10px;
    color: ${colors.PRIMARY.darkest};
`

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableBodyCell
}
