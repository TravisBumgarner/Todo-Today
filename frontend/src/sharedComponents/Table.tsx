import styled from 'styled-components'

const Table = styled.table`
    margin: 1rem 0;
    padding: 1rem;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border: 2px solid ${({theme}) => theme.FOREGROUND_TEXT };
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
        background-color: ${({theme}) => theme.BACKGROUND_PRIMARY };   
    }

    &:nth-child(2n){
        background-color: ${({theme}) => theme.BACKGROUND_PRIMARY };   
    }
    
`

const TableHeaderCell = styled.th`
    background-color: ${({theme}) => theme.BACKGROUND_PRIMARY };
    color: ${({theme}) => theme.FOREGROUND_TEXT }; 
    border-bottom: 2px solid ${({theme}) => theme.FOREGROUND_TEXT };
    padding: 10px;
    text-align: left;
    width: ${({ width }: { width: string }) => width};
    
`
const TableBodyCell = styled.td`
    border-bottom: 2px solid ${({theme}) => theme.FOREGROUND_TEXT };
    padding: 10px;
    color: ${({theme}) => theme.FOREGROUND_TEXT };
`

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableBodyCell
}
