import './assets/css/main.scss'
import { createVueApp } from './createVueApp.ts'

async function main() {
    const node = document.createElement('div')
    node.id = __NAME__
    document.querySelector('body')?.appendChild(node)

    const app = await createVueApp()
    app.mount(node)
}

if (document.readyState !== 'loading') {
    void main()
} else {
    window.addEventListener('DOMContentLoaded', () => {
        void main()
    })
}
