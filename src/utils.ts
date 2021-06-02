import { DELAY_BETWEEN_CHECKING_SELECTOR, MAX_CHECKING_SELECTOR_ATTEMPTS } from './Constants'

export function isOnWorkflowsPage(location: Location): boolean {
    // https://github.com/Trinovantes/userscript-delete-workflow-runs/actions
    const re = /^https:\/\/github.com\/([\w-]+)\/([\w-]+)\/actions$/
    return re.test(location.href)
}

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export async function waitForSelector(parentNode: Element, query: string): Promise<Element> {
    for (let i = 0; i < MAX_CHECKING_SELECTOR_ATTEMPTS; i++) {
        const el = parentNode.querySelector(query)
        if (el) {
            return el
        }

        await sleep(DELAY_BETWEEN_CHECKING_SELECTOR)
    }

    throw new Error(`Failed to find ${query}`)
}
