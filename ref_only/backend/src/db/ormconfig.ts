import path from 'path'
import { ConnectionOptions } from 'typeorm'

const ENTITIES_DIR = __dirname + '/entity'
const MIGRATIONS_DIR = __dirname + '/migration'

const config = {
    type: 'sqlite',
    database: path.join(__dirname, './db.sqlite'),
    synchronize: false,
    logging: false,
    entities: [ENTITIES_DIR + '/**/*{.ts,.js}'],
    migrations: [MIGRATIONS_DIR + '/**/*{.ts,.js}'],
    cli: {
        entitiesDir: ENTITIES_DIR,
        migrationsDir: MIGRATIONS_DIR,
    },
} as ConnectionOptions

export default config