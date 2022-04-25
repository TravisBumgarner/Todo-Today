import {
  gql
} from "@apollo/client";

const GET_PROJECTS = gql`
  query {
    projects {
      id,
      title,
      status,
      description
    }
  }
`;

const ADD_PROJECT = gql`
mutation AddProjectMutation (
    $title: String!
    $status: String!,
    $description: String!,
    $id: String!
  ) {
    addProject(id: $id, title: $title, description: $description, status: $status){
      id,
      title,
      description,
      status
    }
}
`;

const EDIT_PROJECT = gql`
mutation EditProjectMutation (
    $title: String!
    $status: String!,
    $description: String!,
    $id: String!
  ) {
    addProject(id: $id, title: $title, description: $description, status: $status){
      id,
      title,
      description,
      status
    }
}
`;

const DELETE_PROJECT = gql`
mutation DeleteProjectMutation (
    $id: String!
  ) {
    deleteProject(id: $id){
      id
    }
}
`;

const GET_TASKS = gql`
  query {
    tasks {
      id,
      title,
      projectId,
      description
    }
  }
`;

const ADD_TASK = gql`
mutation AddTaskMutation (
    $title: String!
    $projectId: String!,
    $description: String!,
    $id: String!
  ) {
    addTask(id: $id, title: $title, description: $description, projectId: $projectId){
      id,
      title,
      description,
      projectId
    }
}
`;


export {
  GET_PROJECTS,
  ADD_PROJECT,
  EDIT_PROJECT,
  DELETE_PROJECT,
  GET_TASKS,
  ADD_TASK
}