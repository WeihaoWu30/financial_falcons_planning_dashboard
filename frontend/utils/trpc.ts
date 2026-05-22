import type { AppRouter } from '../../backend/index'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>();