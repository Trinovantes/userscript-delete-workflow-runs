import { defineStore } from 'pinia'
import { deleteWorkflowRun } from '../utils/deleteWorkflowRun.ts'

const HYDRATION_KEY = 'KEY_STATE'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type State = {
    numWorkflowRunsToKeep: number
    numDeletionsPerExecution: number
    numDeletionsLeft: number
}

function createDefaultState(): State {
    const defaultState: State = {
        numWorkflowRunsToKeep: 1,
        numDeletionsPerExecution: 10,
        numDeletionsLeft: 0,
    }

    return defaultState
}

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export const useStore = defineStore('Store', {
    state: createDefaultState,

    actions: {
        async load() {
            try {
                const stateString = await GM.getValue(HYDRATION_KEY, '{}')
                const parsedState = JSON.parse(stateString) as State
                this.$patch(parsedState)

                console.info(__NAME__, 'Store::load', parsedState)
            } catch (err) {
                console.warn(__NAME__, err)
            }
        },

        async save() {
            try {
                const stateString = JSON.stringify(this.$state)
                await GM.setValue(HYDRATION_KEY, stateString)
                console.info(__NAME__, 'Store::save', `'${stateString}'`)
            } catch (err) {
                console.warn(__NAME__, err)
            }
        },

        async startDeleting() {
            console.info(__NAME__, 'Store::startDeleting')
            this.numDeletionsLeft = this.numDeletionsPerExecution
            await this.save()
            await this.runPendingWork()
        },

        async stopDeleting() {
            console.info(__NAME__, 'Store::stopDeleting')
            this.numDeletionsLeft = 0
            await this.save()
        },

        async runPendingWork() {
            console.info(__NAME__, 'Store::runPendingWork', this.numDeletionsLeft)

            if (this.numDeletionsLeft < 1) {
                return
            }

            // This will return when there's more deletions queued than workflows left
            const finished = await deleteWorkflowRun(this.numWorkflowRunsToKeep, async () => {
                this.numDeletionsLeft -= 1
                await this.save()
            })

            if (finished) {
                this.numDeletionsLeft = 0
                await this.save()
            }
        },
    },
})
