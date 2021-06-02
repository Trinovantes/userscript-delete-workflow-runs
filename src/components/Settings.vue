<template>
    <div class="group">
        <h3>Example Settings</h3>

        <label for="stringOption">
            String Option
            <input
                id="stringOption"
                v-model="stringOption"
                type="text"
            >
        </label>
        <pre>"{{ stringOption }}" ({{ typeof stringOption }})</pre>

        <label for="numberOption">
            Number Option
            <input
                id="numberOption"
                v-model.number="numberOption"
                type="number"
            >
        </label>
        <pre>"{{ numberOption }}" ({{ typeof numberOption }})</pre>

        <label for="booleanOption">
            Boolean Option
            <input
                id="booleanOption"
                v-model="booleanOption"
                type="checkbox"
            >
        </label>
        <pre>"{{ booleanOption }}" ({{ typeof booleanOption }})</pre>
    </div>

    <div class="group actions">
        <a
            class="btn positive"
            @click="onSave"
        >
            Save
        </a>
        <div class="hspace" />
        <a
            class="btn"
            @click="onClose"
        >
            Cancel
        </a>
    </div>
</template>

<script lang="ts">
import { Action, Mutation, useTypedStore } from '@/store'
import { computed, defineComponent, onMounted } from 'vue'

export default defineComponent({
    emits: [
        'close',
    ],

    setup(props, { emit }) {
        const store = useTypedStore()

        onMounted(async() => {
            await store.dispatch(Action.LOAD, undefined)
        })

        const stringOption = computed({
            get() {
                return store.state.stringOption
            },
            set(val: string) {
                store.commit(Mutation.SET_STRING_OPTION, val)
            },
        })

        const numberOption = computed({
            get() {
                return store.state.numberOption
            },
            set(val: number) {
                store.commit(Mutation.SET_NUMBER_OPTION, val)
            },
        })

        const booleanOption = computed({
            get() {
                return store.state.booleanOption
            },
            set(val: boolean) {
                store.commit(Mutation.SET_BOOLEAN_OPTION, val)
            },
        })

        const onSave = async() => {
            await store.dispatch(Action.SAVE)
            emit('close')
        }

        const onClose = () => {
            emit('close')
        }

        return {
            stringOption,
            numberOption,
            booleanOption,

            onSave,
            onClose,
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

.actions{
    display: flex;
    gap: math.div($padding, 2);

    .hspace{
        flex: 1;
    }
}

label{
    @extend .margins;

    align-items: center;
    display: grid;
    cursor: pointer;
    font-weight: bold;
    gap: math.div($padding, 2);
    grid-template-columns: 1fr 3fr;
}

input{
    border: $border;
    border-radius: $border-radius;
    padding: math.div($padding, 4);

    &:focus{
        border-color: black;
    }
}
</style>
