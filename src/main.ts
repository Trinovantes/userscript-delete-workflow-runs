import UserscriptApp from '@/components/UserscriptApp.vue'
import { createApp } from 'vue'
import { Action, createStore, key } from '@/store'

async function main() {
    await $.when($.ready)

    const appContainerId = DEFINE.NAME
    $('body').append(`<div id="${appContainerId}">`)

    const store = createStore()
    await store.dispatch(Action.LOAD)

    const app = createApp(UserscriptApp)
    app.use(store, key)
    app.mount(`#${appContainerId}`)
}

main().catch((err) => {
    console.warn(DEFINE.NAME, err)
})
