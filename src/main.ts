import UserscriptApp from '@/components/UserscriptApp.vue'
import { createApp } from 'vue'
import { createStore, key } from '@/store'

async function main() {
    await $.when($.ready)

    const appContainerId = 'userscript-app'
    $('body').append(`<div id="${appContainerId}">`)

    const store = createStore()
    const app = createApp(UserscriptApp)
    app.use(store, key)
    app.mount(`#${appContainerId}`)
}

main().catch((err) => {
    console.warn(DEFINE.NAME, err)
})
