import { ApiRouteConfig, Handlers } from 'motia'
import { z } from 'zod'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'HealthCheck',
  description: 'Health check endpoint for monitoring and load balancers',
  flows: [],

  method: 'GET',
  path: '/health',
  bodySchema: z.object({}),
  responseSchema: {
    200: z.object({
      status: z.string(),
      timestamp: z.string(),
      uptime: z.number(),
    }),
  },
  emits: [],
}

export const handler: Handlers['HealthCheck'] = async (req, { logger }) => {
  logger.info('Health check requested')

  return {
    status: 200,
    body: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  }
}
