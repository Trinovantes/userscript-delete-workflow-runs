<script lang="ts" setup>
import { projectTitle, projectUrl } from '@/Constants'
import { useStore } from '@/store/useStore'

const emit = defineEmits(['close'])

const store = useStore()
const save = async() => {
    await store.save()
    emit('close')
}
const cancel = async() => {
    await store.load()
    emit('close')
}
</script>

<template>
    <article>
        <div class="group header flex-vgap">
            <h1>
                {{ projectTitle }}
            </h1>
            <a :href="projectUrl" class="project-url">
                {{ projectUrl }}
            </a>
        </div>

        <div class="group flex-vgap">
            <label for="numWorkflowRunsToKeep">
                Number of Workflow Runs to Keep
                <input
                    id="numWorkflowRunsToKeep"
                    v-model.number="store.numWorkflowRunsToKeep"
                    type="number"
                >
            </label>

            <label for="numDeletionsPerExecution">
                Number of Deletions per Execution
                <input
                    id="numDeletionsPerExecution"
                    v-model.number="store.numDeletionsPerExecution"
                    type="number"
                >
            </label>
        </div>

        <div class="group actions flex-hgap">
            <button
                class="positive"
                @click="save"
            >
                Save
            </button>
            <div class="flex-1" />
            <button
                @click="cancel"
            >
                Cancel
            </button>
        </div>
    </article>
</template>

<style lang="scss" scoped>
article{
    display: grid;
    max-height: 80vh;
    overflow-y: auto;
}

.group{
    padding: $padding;

    &:not(:first-child){
        border-top: $border;
    }

    &.header{
        gap: math.div($padding, 2);
    }
}

label{
    font-weight: bold;
}
</style>
