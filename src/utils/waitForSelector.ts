import { MAX_CHECKING_SELECTOR_ATTEMPTS, DELAY_BETWEEN_CHECKING_SELECTOR } from '@/Constants'
import { sleep } from './sleep'

export async function waitForSelector<T extends Element>(parentNode: Element | Document, query: string): Promise<T> {
    for (let i = 0; i < MAX_CHECKING_SELECTOR_ATTEMPTS; i++) {
        const el = parentNode.querySelector(query)
        if (el) {
            return el as T
        }

        await sleep(DELAY_BETWEEN_CHECKING_SELECTOR)
    }

    throw new Error(`Failed to find ${query}`)
}
