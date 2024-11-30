import { ref } from 'vue'

export function useIsOnWorkflowsPage() {
    const re = /^https:\/\/github.com\/([\w-]+)\/([\w-]+)\/actions$/
    const isOnWorkflowsPage = ref(re.test(window.location.href))

    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.history.pushState = new Proxy(window.history.pushState, {
        apply: (target, thisArg, argArray: [unknown, string, string]) => {
            isOnWorkflowsPage.value = re.test(argArray[2])
            console.info(__NAME__, 'useIsOnWorkflowsPage', isOnWorkflowsPage.value)
            target.apply(thisArg, argArray)
        },
    })

    return {
        isOnWorkflowsPage,
    }
}
