import { Column, Entity, PrimaryColumn, ManyToOne } from 'typeorm'

import Project from './project'

type TaskColumns = {
    title: string
    id: string
    description: string
    project: Project
}

@Entity()
export default class Task {
    constructor(columns: TaskColumns) {
        const {
            title,
            id,
            description,
            project
        } = columns || {}

        this.title = title
        this.id = id
        this.description = description
        this.project = project
    }

    @PrimaryColumn({ nullable: false })
    id: string

    @Column({ nullable: false })
    title: string

    @Column({ nullable: false })
    description: string

    @ManyToOne(() => Project, project => project.tasks)
    project: Project;

}