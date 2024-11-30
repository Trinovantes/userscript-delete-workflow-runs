import { UI_WAIT_TIME } from '../Constants.ts'
import { findDelayedElement } from './findDelayedElement.ts'
import { sleep } from './sleep.ts'

export async function deleteWorkflowRun(numWorkflowRunsToKeep: number, onBeforeDelete?: () => Promise<void>) {
    const container = await findDelayedElement('#partial-actions-workflow-runs')
    const actionBtns = container.querySelectorAll('summary.timeline-comment-action')

    // Check if there is an N+1 btn
    const numWorkflows = actionBtns.length
    if (numWorkflowRunsToKeep >= numWorkflows) {
        console.info(__NAME__, `Finished numWorkflows:${numWorkflows} numWorkflowRunsToKeep:${numWorkflowRunsToKeep}`)
        return true
    }

    const actionBtn = actionBtns[numWorkflowRunsToKeep] as HTMLButtonElement
    const actionContainer = actionBtn.parentElement
    if (!actionContainer) {
        throw new Error('Cannot find parent of actionBtn')
    }

    await clickBtn('actionBtn', actionBtn)

    const menu = await findDelayedElement('ul.dropdown-menu', actionContainer)
    const deleteBtn = await findDelayedElement('button.menu-item-danger', menu)
    if (deleteBtn.innerText !== 'Delete workflow run') {
        throw new Error('Cannot find delete workflow button')
    }

    await clickBtn('deleteBtn', deleteBtn, () => {
        return menu.querySelector('dialog[open]') === null
    })

    const dialog = await findDelayedElement('dialog[open]', menu)
    const confirmBtn = await findDelayedElement('button.Button--danger', dialog)
    if (confirmBtn.innerText !== 'Yes, delete this workflow run') {
        throw new Error('Cannot find confirmation btn in dialog')
    }

    // Clicking confirmBtn will refresh the page
    // This will run any cleanup tasks before page gets refreshed
    await onBeforeDelete?.()

    await clickBtn('confirmBtn', confirmBtn)
    return false
}

async function clickBtn(btnName: string, btn: HTMLElement, shouldRetry?: () => boolean) {
    console.groupCollapsed(__NAME__, 'Clicking', btnName)

    if (shouldRetry) {
        do {
            console.info(btn)
            btn.click()
            await sleep(UI_WAIT_TIME)
        } while (shouldRetry())
    } else {
        console.info(btn)
        btn.click()
    }

    console.groupEnd()
}
