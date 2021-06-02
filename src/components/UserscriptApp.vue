<template>
    <div class="userscript-app">
        <div v-if="isOpen" class="dialog-wrapper">
            <div class="dialog">
                <h1>
                    {{ title }}
                </h1>
                <a :href="projectUrl" class="url">
                    {{ projectUrl }}
                </a>

                <Settings
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

<script lang="ts">
import { Action, Mutation, useTypedStore } from '@/store'
import { ref, defineComponent, onMounted, computed } from 'vue'
import Settings from './Settings.vue'
import { deleteWorkflowRuns } from '@/DeleteWorkflowRuns'

export default defineComponent({
    components: {
        Settings,
    },

    setup() {
        const isOpen = ref(false)

        const store = useTypedStore()
        const numDeletionsLeft = computed(() => store.state._numDeletionsLeft)
        const run = async() => {
            if (numDeletionsLeft.value < 1) {
                console.info(DEFINE.NAME, 'No runs left to run')
                return
            }

            await deleteWorkflowRuns(store.state.numWorkflowRunsToKeep, async() => {
                store.commit(Mutation.SET_NUM_DELETIONS_LEFT, numDeletionsLeft.value - 1)
                await store.dispatch(Action.SAVE)
            })
        }

        const stopDeleting = async() => {
            store.commit(Mutation.SET_NUM_DELETIONS_LEFT, 0)
            await store.dispatch(Action.SAVE)
        }

        const startDeleting = async() => {
            store.commit(Mutation.SET_NUM_DELETIONS_LEFT, store.state.numDeletionsPerExecution)
            await store.dispatch(Action.SAVE)
            await run()
        }

        onMounted(run)

        return {
            title: `${DEFINE.PRODUCT_NAME} ${DEFINE.VERSION}`,
            projectUrl: DEFINE.REPO.url,
            isOpen,
            numDeletionsLeft,
            stopDeleting,
            startDeleting,
        }
    },
})
</script>

<style lang="scss" scoped>
.userscript-app{
    *{
        background: none;
        outline: none;
        border: none;
        margin: 0;
        padding: 0;

        color: #111;
        font-size: 15px;
        font-weight: normal;
        line-height: 1.5;
    }

    a{
        color: blue;
        text-decoration: none;

        &:hover{
            text-decoration: underline;
        }
    }

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

            h1{
                font-size: 24px;
                font-weight: bold;
            }

            a.url{
                display: block;
                margin-bottom: $padding;
            }
        }
    }
}
</style>
