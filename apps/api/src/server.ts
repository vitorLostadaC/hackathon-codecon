import dotenv from 'dotenv'
dotenv.config()

import Fastify from 'fastify'
import { routes } from './route'

const fastify = Fastify({
	logger: {
		enabled: true,
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: false,
				ignore: 'pid,hostname,level,time,reqId'
			}
		}
	},
	disableRequestLogging: true
})

fastify.register(routes)

fastify.listen({ port: 3333 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
