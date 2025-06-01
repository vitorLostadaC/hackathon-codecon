import type { FastifyReply, FastifyRequest } from 'fastify'
import { STATUS_CODES } from 'node:http'

export class AppError extends Error {
	error: string
	message: string
	statusCode: number

	constructor(error: string, message: string, statusCode: number) {
		super(message)

		this.error = error
		this.message = message
		this.statusCode = statusCode

		Error.captureStackTrace(this, this.constructor)
	}
}

export const errorHandler = (err: AppError, request: FastifyRequest, reply: FastifyReply) => {
	console.log(err)
	return reply.code(err.statusCode ?? 500).send({
		error: err.error ?? STATUS_CODES[err.statusCode],
		message: err.message
	})
}
