import { MAX_CHECKING_SELECTOR_ATTEMPTS, DELAY_BETWEEN_CHECKING_SELECTOR } from '@/Constants'
import { sleep } from './sleep'

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
