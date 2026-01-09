import { z } from 'zod';
import { insertSignalSchema, signals } from './schema';

export const api = {
  signals: {
    list: {
      method: 'GET' as const,
      path: '/api/signals',
      responses: {
        200: z.array(z.custom<typeof signals.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/signals',
      input: z.object({ pair: z.string() }),
      responses: {
        201: z.custom<typeof signals.$inferSelect>(),
        500: z.object({ message: z.string() }),
      },
    },
    latest: {
      method: 'GET' as const,
      path: '/api/signals/latest',
      responses: {
        200: z.custom<typeof signals.$inferSelect>().nullable(),
      },
    }
  },
  market: {
    data: {
      method: 'GET' as const,
      path: '/api/market/:pair',
      responses: {
        200: z.array(z.object({
          time: z.string(),
          value: z.number(),
        })),
      }
    }
  }
};
