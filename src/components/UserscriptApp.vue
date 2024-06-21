<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { projectTitle } from '@/Constants'
import { useStore } from '@/store/useStore'
import { useIsOnWorkflowsPage } from '@/utils/useIsOnWorkflowsPage'
import UserscriptAppSettings from './UserscriptAppSettings.vue'

/**
 * Whenever a workflow is deleted (e.g. clicking confirm button), the page will refresh
 * As a result, whenever we are mounted, we need to check if there are pending work and run if necessary
 */
const store = useStore()
const { isOnWorkflowsPage } = useIsOnWorkflowsPage()
onMounted(async() => {
    if (!isOnWorkflowsPage.value) {
        return
    }

    await store.runPendingWork()
})

const dialogRef = ref<HTMLDialogElement | null>(null)
</script>

<template>
    <div
        v-if="isOnWorkflowsPage"
        class="userscript-delete-workflow-runs"
    >
        <dialog
            ref="dialogRef"
        >
            <UserscriptAppSettings
                @close="dialogRef?.close()"
            />
        </dialog>

        <button
            v-if="store.numDeletionsLeft > 0"
            class="stop-btn"
            :title="`${store.numDeletionsLeft} deletions left`"
            @click="store.stopDeleting()"
        >
            Stop
        </button>
        <button
            v-else
            class="start-btn"
            @click="store.startDeleting()"
        >
            Start
        </button>

        <button
            class="settings-btn"
            :title="projectTitle"
            @click="dialogRef?.showModal()"
        >
            Settings
        </button>
    </div>
</template>

<style lang="scss" scoped>
button.stop-btn,
button.start-btn,
button.settings-btn{
    background-image: url('@/assets/img/settings.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50% 50%;
    border-radius: 50%;
    border: $border;
    cursor: pointer;
    display: block;
    overflow: hidden;
    text-decoration: none;
    text-indent: -9999px;
    transition: 0.25s;
    width: $btn-size; height: $btn-size;

    position: fixed;
    z-index: 9999;
    right: $padding;

    background-color: white;
    box-shadow: rgba(11, 11, 11, 0.1) 0 2px 8px;

    &:hover{
        background-color: #eee;
        box-shadow: rgba(11, 11, 11, 0.4) 0 0px 8px;
    }
}

button.stop-btn{
    background-image: url('@/assets/img/stop.png');
    bottom: $padding + $btn-size + $padding + $btn-size + $padding;
}

button.start-btn{
    background-image: url('@/assets/img/start.png');
    bottom: $padding + $btn-size + $padding + $btn-size + $padding;
}

button.settings-btn{
    background-image: url('@/assets/img/settings.png');
    bottom: $padding + $btn-size + $padding;
}
</style>
