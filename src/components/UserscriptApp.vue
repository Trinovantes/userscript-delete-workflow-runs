<script lang="ts">
import { ref, defineComponent, onMounted, computed } from 'vue'
import UserscriptAppSettings from './UserscriptAppSettings.vue'
import { useStore } from '@/store'
import { deleteWorkflowRuns } from '@/services/github/deleteWorkflowRuns'

export default defineComponent({
    components: {
        UserscriptAppSettings,
    },

    setup() {
        const store = useStore()
        const numDeletionsLeft = computed(() => store.numDeletionsLeft)
        const run = async() => {
            if (numDeletionsLeft.value < 1) {
                console.info(DEFINE.NAME, 'No runs left to run')
                return
            }

            await deleteWorkflowRuns(store.numWorkflowRunsToKeep, async() => {
                store.numDeletionsLeft = numDeletionsLeft.value - 1
                await store.save()
            })
        }

        const stopDeleting = async() => {
            store.numDeletionsLeft = 0
            await store.save()
        }

        const startDeleting = async() => {
            store.numDeletionsLeft = store.numDeletionsPerExecution
            await store.save()
            await run()
        }

        onMounted(run)

        return {
            title: `${DEFINE.PRODUCT_NAME} ${DEFINE.VERSION}`,
            projectUrl: DEFINE.REPO.url,
            isOpen: ref(false),
            numDeletionsLeft,
            stopDeleting,
            startDeleting,
        }
    },
})
</script>

<template>
    <div class="userscript-delete-workflow-runs">
        <div
            v-if="isOpen"
            class="dialog-wrapper"
        >
            <div class="dialog">
                <UserscriptAppSettings
                    @close="isOpen = false"
                />
            </div>
        </div>

        <a
            v-if="numDeletionsLeft > 0"
            class="stop-btn"
            :title="`${numDeletionsLeft} deletions left`"
            @click="stopDeleting"
        >
            Stop
        </a>
        <a
            v-else
            class="start-btn"
            @click="startDeleting"
        >
            Start
        </a>

        <a
            class="settings-btn"
            :title="title"
            @click="isOpen = true"
        >
            Settings
        </a>
    </div>
</template>

<style lang="scss">
.userscript-delete-workflow-runs *{
    background: none;
    outline: none;
    border: none;
    margin: 0;
    padding: 0;

    color: #111;
    font-size: 15px;
    font-weight: normal;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    vertical-align: baseline;
}
</style>

<style lang="scss" scoped>
a.stop-btn,
a.start-btn,
a.settings-btn{
    @extend .icon-btn;

    position: fixed;
    right: $padding;
    z-index: 9999;

    box-shadow: rgba(11, 11, 11, 0.1) 0 2px 8px;

    &:hover{
        box-shadow: rgba(11, 11, 11, 0.4) 0 0px 8px;
    }
}

a.stop-btn{
    background-image: url('@/assets/img/stop.png');
    bottom: $padding + $btn-size + $padding + $btn-size + $padding;
}

a.start-btn{
    background-image: url('@/assets/img/start.png');
    bottom: $padding + $btn-size + $padding + $btn-size + $padding;
}

a.settings-btn{
    background-image: url('@/assets/img/settings.png');
    bottom: $padding + $btn-size + $padding;
}

.dialog-wrapper{
    background: rgba(11, 11, 11, 0.4);

    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 99999;

    > .dialog{
        background: white;
        padding: $padding;
        border-radius: $border-radius;

        position: absolute;
        top: 50%; left: 50%;
        transform: translateY(-50%) translateX(-50%);
        min-width: $min-dialog-width;
    }
}
</style>
