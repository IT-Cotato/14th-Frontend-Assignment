import { setupWorker } from 'msw/browser'
import { createTeamHandlers } from './team'

export const worker = setupWorker(...createTeamHandlers({
  storage: {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value),
  },
}))
