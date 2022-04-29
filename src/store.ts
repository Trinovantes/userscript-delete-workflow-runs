import { defineStore } from 'pinia'
import { KEY_STATE } from '@/Constants'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export interface State {
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
                const stateString = await GM.getValue(KEY_STATE, '{}') || '{}'
                const parsedState = JSON.parse(stateString) as State
                this.$patch(parsedState)

                console.info(DEFINE.NAME, 'Store::load', parsedState)
            } catch (err) {
                console.warn(DEFINE.NAME, err)
            }
        },

        async save() {
            try {
                const stateString = JSON.stringify(this.$state)
                await GM.setValue(KEY_STATE, stateString)
                console.info(DEFINE.NAME, 'Store::save', `'${stateString}'`)
            } catch (err) {
                console.warn(DEFINE.NAME, err)
            }
        },
    },
})
