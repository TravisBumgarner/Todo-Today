import express from 'express';
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'
import { graphqlHTTP } from 'express-graphql'
import cors from 'cors'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,

} from 'graphql'

import { entity } from './db'
import { APIResponse, ProjectStatus, Project, Task } from '../../sharedTypes'

const app = express()

app.use(cors())

const TaskType = new GraphQLObjectType({
  name: 'Task',
  description: 'This represents a task',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    projectId: { type: GraphQLNonNull(GraphQLString) }, //todo fix
  })
})

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  description: 'This represents a project',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLNonNull(GraphQLString) }, //todo fix
  })
})

type AddProjectMutationArgs = {
  title: string
  id: string
  description: string
  status: ProjectStatus
}

type AddTaskMutationArgs = {
  title: string
  id: string
  description: string
  projectId: string
}

type EditProjectMutationArgs = {
  title: string
  id: string
  description: string
  status: ProjectStatus
}

type DeleteProjectMutationArgs = {
  id: string
}


const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addProject: {
      type: ProjectType,
      description: 'Add a Project',
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent: undefined, args: AddProjectMutationArgs) => {
        return await getConnection()
          .getRepository(entity.Project)
          .save({
            ...args
          })

      }
    },
    editProject: {
      type: ProjectType,
      description: 'Edit a Project',
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent: undefined, args: EditProjectMutationArgs) => {
        return await getConnection()
          .getRepository(entity.Project)
          .save({
            ...args
          })
      }
    },
    deleteProject: {
      type: ProjectType,
      description: 'Delete a Project',
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent: undefined, args: DeleteProjectMutationArgs) => {
        const result = await getConnection()
          .getRepository(entity.Project)
          .delete({
            ...args
          })
        console.log(result)
        return { id: args.id }
      }
    },
    addTask: {
      type: TaskType,
      description: 'Add a Task',
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        projectId: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent: undefined, args: AddTaskMutationArgs) => {
        console.log(args)
        const connection = await getConnection()
        console.log('looking up project id', args.projectId)
        const project = await connection
          .getRepository(entity.Project)
          .createQueryBuilder('project')
          .where('project.id = :id', { id: args.projectId })
          .getOne()

        return await getConnection()
          .getRepository(entity.Task)
          .save({
            title: args.title,
            id: args.id,
            description: args.description,
            project: project
          })

      }
    },
  })
})


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    projects: {
      type: new GraphQLList(ProjectType),
      description: 'List of All Projects',
      args: {},
      resolve: async () => {
        return await getConnection()
          .getRepository(entity.Project)
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.tasks', 'task')
          .getMany()

      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      description: 'List of All Tasks',
      args: {},
      resolve: async () => {
        const results = await getConnection()
          .getRepository(entity.Task)
          .createQueryBuilder('task')
          .getMany() //todo make this return ProjectIDs instead of projects
        console.log(results)
        return results

      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('pong!')
})

app.get('/set_project/:project', async (req: express.Request, res: express.Response<APIResponse>) => {
  try {
    const connection = await getConnection()

    const project = new entity.Project({
      id: uuidv4(),
      title: req.params.project,
      description: "Api created project",
      status: ProjectStatus.ACTIVE,
      tasks: []
    })
    console.log(project.id)
    await connection.manager.save(project)

    const task = new entity.Task({
      id: uuidv4(),
      title: req.params.project,
      description: "Api created task",
      project: project
    })

    console.log('saving', task)

    await connection.manager.save(task)

    res.send({ success: true, data: "Successfully Inserted" })
  } catch (error) {
    console.log(JSON.stringify(error))
    res.send({ success: false, error: "Something went wrong" })
  }
})


export default app