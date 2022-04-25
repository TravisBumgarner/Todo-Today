import * as React from 'react'
// import moment from 'moment'
// import styled from 'styled-components'

// import { context } from '.'
// import { Task } from '../../../../sharedTypes'
// import { areDatesEqual } from '../utilities'

// const Wrapper = styled.div`
//     display: flex;
//     flex-direction: row;

//     > :first-child {
//         width: 30%;
//     }

//     > :last-child {
//         width: 70%;
//     }
// `

// const TasksByProjectList = () => {
//     const { state, dispatch } = React.useContext(context)

//     const tasksByProject = Object.values(state.projects).reduce((accum, { id }) => {
//         accum[id] = []
//         return accum
//     }, {} as Record<string, Task[]>)

//     console.log(tasksByProject)
//     Object.values(state.tasks).forEach(task => {
//         tasksByProject[task.projectId].push(task)
//     })

//     const handleSubmit = (id: string) => {
//         dispatch({ type: 'AGENDA_ITEM_CREATED', data: { id } })
//     }

//     return (
//         <ul>
//             {
//                 Object.keys(tasksByProject).map(projectId => {
//                     return (
//                         <li key={projectId}>
//                             {state.projects[projectId].title}
//                             <ul>{tasksByProject[projectId].map(task => {
//                                 return <li key={task.id}>{task.title} <button onClick={() => handleSubmit(task.id)}>Add to Today</button></li>
//                             })}</ul>
//                         </li >
//                     )
//                 })
//             }
//         </ul>
//     )
// }

// const YourDay = () => {
//     const { state, dispatch } = React.useContext(context)

//     const tasksForToday = state.agenda.map(taskId => state.tasks[taskId])

//     const handleDelete = (id: string) => {
//         dispatch({ type: 'AGENDA_ITEM_DELETED', data: { id } })
//     }

//     return <ul>
//         {tasksForToday.map(({ title, projectId, id }) => {
//             return <li key={id}>{state.projects[projectId].title} - {title} <button onClick={() => handleDelete(id)}>Remove</button> </li>
//         })}
//     </ul>
// }

// const PlanYourDay = () => {
//     const { state, dispatch } = React.useContext(context)
//     const [selectedDate, setSelectedDate] = React.useState<moment.Moment>(moment())

//     const setPreviousDay = () => {
//         setSelectedDate(selectedDate.clone().add(-1, 'days'))
//     }

//     const setNextDay = () => {
//         setSelectedDate(selectedDate.clone().add(1, 'days'))
//     }

//     const setToday = () => {
//         setSelectedDate(moment())
//     }

//     const handleKeyPress = (event: KeyboardEvent) => {
//         if (event.key === "ArrowLeft") {
//             setPreviousDay()
//         } else if (event.key === "ArrowRight") {
//             setNextDay()
//         }
//     }

//     React.useEffect(() => {
//         window.addEventListener("keydown", handleKeyPress);
//         return () => {
//             window.removeEventListener("keydown", handleKeyPress);
//         };
//     }, [selectedDate])


//     return (
//         <div>
//             <button onClick={setPreviousDay}>Prev</button><h1>{selectedDate.format("dddd, MMMM Do YYYY")}</h1><button onClick={setPreviousDay}>Next</button>
//             {!areDatesEqual(moment(), selectedDate) ? <button onClick={setToday}>Return to Today</button> : null}
//             <h2>Plan Your Day</h2>
//             <Wrapper>
//                 <TasksByProjectList />
//                 <YourDay />
//             </Wrapper>
//         </div>
//     )
// }

// export default PlanYourDay


const app = () => {
    return <p>Hi.</p>
}

export default app