import { Record, Number } from 'runtypes'

const Env = Record({
    expressPortname: Number
})

const getEnv = () => {
    const env = {
        expressPortname: parseInt(process.env.EXPRESS_PORTNAME || '')
    }

    try {
        return Env.check(env)
    } catch (error) {
        throw Error('Invalil project config')
    }
}

const config = getEnv()

export default config