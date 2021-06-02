import { InjectionKey } from 'vue'
import { createStore as _createStore, Store, useStore, MutationTree, ActionTree, CommitOptions, ActionContext, DispatchOptions } from 'vuex'
import { KEY_STATE } from '@/Constants'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export interface State {
    stringOption: string
    numberOption: number
    booleanOption: boolean
}

function createDefaultState(): State {
    const defaultState: State = {
        stringOption: '',
        booleanOption: false,
        numberOption: 0,
    }

    return defaultState
}

// ----------------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------------

export enum Mutation {
    REPLACE_STATE = 'REPLACE_STATE',
    SET_STRING_OPTION = 'SET_STRING_OPTION',
    SET_NUMBER_OPTION = 'SET_NUMBER_OPTION',
    SET_BOOLEAN_OPTION = 'SET_BOOLEAN_OPTION',
}

interface Mutations {
    [Mutation.REPLACE_STATE]: (state: State, payload: State) => void
    [Mutation.SET_STRING_OPTION]: (state: State, payload?: string) => void
    [Mutation.SET_NUMBER_OPTION]: (state: State, payload?: number) => void
    [Mutation.SET_BOOLEAN_OPTION]: (state: State, payload?: boolean) => void
}

const mutations: MutationTree<State> & Mutations = {
    [Mutation.REPLACE_STATE]: (state: State, payload?: State) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        Object.assign(state, payload)
    },

    [Mutation.SET_STRING_OPTION]: (state: State, payload?: string) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.stringOption = payload
    },

    [Mutation.SET_NUMBER_OPTION]: (state: State, payload?: number) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.numberOption = payload
    },

    [Mutation.SET_BOOLEAN_OPTION]: (state: State, payload?: boolean) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.booleanOption = payload
    },
}

// ----------------------------------------------------------------------------
// Actions
// ----------------------------------------------------------------------------

export enum Action {
    LOAD = 'LOAD',
    SAVE = 'SAVE',
}

type TypedActionContext = Omit<ActionContext<State, State>, 'commit' | 'dispatch' | 'getters' | 'rootState' | 'rootGetters'> & {
    commit<K extends keyof Mutations>(
        key: K,
        payload?: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>

    // eslint-disable-next-line no-use-before-define
    dispatch<K extends keyof Actions>(
        key: K,
        // eslint-disable-next-line no-use-before-define
        payload?: Parameters<Actions[K]>[1]
    // eslint-disable-next-line no-use-before-define
    ): ReturnType<Actions[K]>
}

interface Actions {
    [Action.LOAD]: (context: TypedActionContext) => Promise<void>
    [Action.SAVE]: (context: TypedActionContext) => Promise<void>
}

const actions: ActionTree<State, State> & Actions = {
    [Action.LOAD]: async({ commit }) => {
        try {
            const stateString = await GM.getValue(KEY_STATE, '{}') || '{}'
            const parsedState = JSON.parse(stateString) as State

            commit(Mutation.REPLACE_STATE, {
                ...createDefaultState(),
                ...parsedState,
            })

            console.info(DEFINE.NAME, Action.LOAD, parsedState)
        } catch (err) {
            console.warn(DEFINE.NAME, err)
        }
    },

    [Action.SAVE]: async({ state }) => {
        try {
            const stateString = JSON.stringify(state)
            await GM.setValue(KEY_STATE, stateString)
            console.info(DEFINE.NAME, Action.SAVE, `'${stateString}'`)
        } catch (err) {
            console.warn(DEFINE.NAME, err)
        }
    },
}

// ----------------------------------------------------------------------------
// TypeScript Helpers
// ----------------------------------------------------------------------------

export function createStore(): Store<State> {
    return _createStore<State>({
        strict: DEFINE.IS_DEV,

        state: createDefaultState,
        mutations,
        actions,
    })
}

type TypedStore = Omit<Store<State>, 'commit' | 'dispatch' | 'getters'> & {
    commit<K extends keyof Mutations>(
        key: K,
        payload?: Parameters<Mutations[K]>[1],
        options?: CommitOptions
    ): ReturnType<Mutations[K]>
} & {
    dispatch<K extends keyof Actions>(
        key: K,
        payload?: Parameters<Actions[K]>[1],
        options?: DispatchOptions
    ): ReturnType<Actions[K]>
}

export const key: InjectionKey<TypedStore> = Symbol('Vuex InjectionKey')

export function useTypedStore(): TypedStore {
    return useStore(key)
}
