require('dotenv').config({ path: '.env' })
import { createConnection } from 'typeorm'

import ormconfig from './src/db/ormconfig'
import app from './src/app'
import config from './src/config'

const catchError = (error: unknown) => {
  console.log(error)
  process.exit(1)
}

const startup = async () => {
  await createConnection(ormconfig).catch(catchError)
  await app.listen(config.expressPortname, () => {
    console.log(`App listening at http://localhost:${config.expressPortname}`)
  })
}

startup()




