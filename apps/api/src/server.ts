import dotenv from 'dotenv'
dotenv.config()

import { clerkPlugin, getAuth } from '@clerk/fastify'
import cors from '@fastify/cors'
import Fastify from 'fastify'
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler
} from 'fastify-type-provider-zod'
import { env } from './env'
import { errorHandler } from './helpers/error-handler'
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
	bodyLimit: 1024 * 1024 * 10, // 10MB
	disableRequestLogging: true
}).withTypeProvider<ZodTypeProvider>()

fastify.register(clerkPlugin, {
	hookName: 'onRequest'
})

fastify.register(cors, {
	origin: [env.FRONTEND_URL],
	credentials: true
})

fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

fastify.addHook('onRequest', async (request, reply) => {
	const isPublicRoute = request.routeOptions.config?.url.includes('webhook')

	const adminHeader = request.headers['x-admin']
	const allowAccess = (adminHeader === 'dev' && env.NODE_ENV === 'development') || isPublicRoute

	if (allowAccess) {
		return
	}
	const { userId } = getAuth(request)

	if (!userId) {
		return reply.code(401).send({ error: 'Unauthorized' })
	}

	return
})

fastify.register(routes)

fastify.setErrorHandler(errorHandler)

fastify.listen({ port: 3333 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
