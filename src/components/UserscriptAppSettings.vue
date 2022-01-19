<template>
    <div class="group">
        <label for="numWorkflowRunsToKeep">
            Number of Workflow Runs to Keep
            <input
                id="numWorkflowRunsToKeep"
                v-model.number="numWorkflowRunsToKeep"
                type="number"
            >
        </label>

        <label for="numDeletionsPerExecution">
            Number of Deletions per Execution
            <input
                id="numDeletionsPerExecution"
                v-model.number="numDeletionsPerExecution"
                type="number"
            >
        </label>
    </div>

    <div class="group actions">
        <a
            class="btn positive"
            @click="save(); $emit('close')"
        >
            Save
        </a>
        <div class="hspace" />
        <a
            class="btn"
            @click="$emit('close')"
        >
            Cancel
        </a>
    </div>
</template>

<script lang="ts">
import { Action, Mutation, useTypedStore } from '@/store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    emits: [
        'close',
    ],

    setup() {
        const store = useTypedStore()

        const numWorkflowRunsToKeep = computed({
            get() {
                return store.state.numWorkflowRunsToKeep
            },
            set(val: number) {
                store.commit(Mutation.SET_NUM_WORKFLOW_RUNS_TO_KEEEP, val)
            },
        })

        const numDeletionsPerExecution = computed({
            get() {
                return store.state.numDeletionsPerExecution
            },
            set(val: number) {
                store.commit(Mutation.SET_NUM_DELETIONS_PER_EXECUTION, val)
            },
        })

        const save = async() => {
            await store.dispatch(Action.SAVE)
        }

        return {
            numWorkflowRunsToKeep,
            numDeletionsPerExecution,
            save,
        }
    },
})
</script>

<style lang="scss" scoped>
.group{
    border-top: $border;
    padding: $padding 0;

    &:last-child{
        padding-bottom: 0;
    }
}

label{
    @extend .margins;

    align-items: center;
    display: grid;
    cursor: pointer;
    font-weight: bold;
    gap: math.div($padding, 2);
    grid-template-columns: 1fr 2fr;
}

input{
    font-weight: normal;

    border: $border;
    border-radius: $border-radius;
    padding: math.div($padding, 4);

    &:focus{
        border-color: black;
    }
}

.actions{
    display: flex;
    gap: math.div($padding, 2);

    .hspace{
        flex: 1;
    }
}

a.btn{
    background-color: white;
    border: $border;
    border-radius: $border-radius;
    cursor: pointer;
    display: inline-block;
    padding: math.div($padding, 4) math.div($padding, 2);
    text-decoration: none;

    &:hover{
        background-color: #eee;
    }

    &.positive{
        background-color: green;
        border-color: darkgreen;
        color: white;

        &:hover{
            background-color: darkgreen;
        }
    }
}
</style>
