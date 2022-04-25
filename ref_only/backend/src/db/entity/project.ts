import { Column, Entity, ManyToOne, PrimaryColumn, OneToMany } from 'typeorm'

import Task from './task'
import { ProjectStatus } from '../../../../sharedTypes'

type ProjectColumns = {
    title: string
    id: string
    description: string
    status: ProjectStatus
    tasks: any
}

@Entity()
export default class Project {
    constructor(columns: ProjectColumns) {
        const {
            title,
            id,
            description,
            status
        } = columns || {}

        this.title = title
        this.id = id
        this.description = description
        this.status = status
    }

    @PrimaryColumn({ nullable: false })
    id: string

    @Column({ nullable: false })
    title: string

    @Column({ nullable: false })
    description: string

    @Column({ nullable: false, enum: ProjectStatus })
    status: ProjectStatus

    @OneToMany(() => Task, task => task.project, { onDelete: "CASCADE" })
    tasks: Task[];
}