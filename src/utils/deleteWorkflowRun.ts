import { UI_WAIT_TIME } from '../Constants.ts'
import { findDelayedElement } from './findDelayedElement.ts'
import { sleep } from './sleep.ts'

// Returns true if deleted a workflow
export async function deleteWorkflowRun(numWorkflowRunsToKeep: number): Promise<boolean> {
    try {
        console.groupCollapsed('deleteWorkflowRun')

        const container = await findDelayedElement('section[aria-label="Workflow runs"]')
        const actionBtns = container.querySelectorAll('ul[data-listview-component="items-list"] li button[data-component="IconButton"]')
        if (actionBtns.length === 0) {
            console.info('Stopping because there are no more workflows')
            return false
        }
        if (actionBtns.length <= numWorkflowRunsToKeep) {
            console.info(`Stopping because there are less workflows (${actionBtns.length}) than numWorkflowRunsToKeep (${numWorkflowRunsToKeep})`)
            return false
        }

        const actionBtn = actionBtns[numWorkflowRunsToKeep] as HTMLButtonElement
        await clickButton('actionBtn', actionBtn, () => {
            return document.querySelector('#__primerPortalRoot__ div[data-component="Portal"] ul[role="menu"]') === null
        })

        const deleteBtn = await findDelayedElement('#__primerPortalRoot__ div[data-component="Portal"] ul[role="menu"] > li[data-component="ActionList.Item"][data-variant="danger"]')
        await clickButton('deleteBtn', deleteBtn, () => {
            return document.querySelector('#__primerPortalRoot__ div[data-component="Portal"] div[role="alertdialog"]') === null
        })

        const confirmBtn = await findDelayedElement('#__primerPortalRoot__ div[data-component="Portal"] div[role="alertdialog"] button[data-variant="danger"]')
        await clickButton('confirmBtn', confirmBtn, () => {
            return document.querySelector('#__primerPortalRoot__ div[data-component="Portal"] div[role="alertdialog"]') !== null
        })

        return true
    } finally {
        console.groupEnd()
    }
}

async function clickButton(label: string, btn: HTMLElement, shouldRetry?: () => boolean): Promise<void> {
    if (shouldRetry) {
        do {
            console.info(`Clicking ${label}`, btn)
            btn.click()
            await sleep(UI_WAIT_TIME)
        } while (shouldRetry())
    } else {
        console.info(`Clicking ${label}`)
        btn.click()
    }
}
