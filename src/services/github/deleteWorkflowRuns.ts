import { isOnWorkflowsPage } from '@/utils/isOnWorkflowsPage'
import { waitForSelector } from '@/utils/waitForSelector'

export async function deleteWorkflowRuns(numWorkflowRunsToKeep: number, onBeforeDelete?: () => Promise<void>): Promise<void> {
    if (!isOnWorkflowsPage(window.location)) {
        console.warn(DEFINE.NAME, 'Not on workflows page')
        return
    }

    const container = document.querySelector('#partial-actions-workflow-runs')
    if (!container) {
        throw new Error('Cannot find container')
    }

    const actionBtns = container.querySelectorAll('summary.timeline-comment-action')
    let i = 0

    for (const actionBtn of actionBtns) {
        // Skip the first N runs to keep
        i += 1
        if (i <= numWorkflowRunsToKeep) {
            console.info(DEFINE.NAME, `Skipping ${i}/${numWorkflowRunsToKeep}`, actionBtn)
            continue
        }

        // Delete the N+1 run
        return await deleteWorkflowRun(actionBtn as HTMLButtonElement, onBeforeDelete)
    }
}

async function deleteWorkflowRun(actionBtn: HTMLButtonElement, onBeforeDelete?: () => Promise<void>): Promise<void> {
    const parent = actionBtn.parentElement
    if (!parent) {
        throw new Error('Cannot find parent of actionBtn')
    }

    console.info(DEFINE.NAME, 'Clicking actionBtn', actionBtn)
    actionBtn.click()

    const menu = parent.querySelector('ul.dropdown-menu')
    if (!menu) {
        throw new Error('Cannot find drop down menu')
    }

    const deleteBtn = menu.querySelector('summary.menu-item-danger') as HTMLButtonElement | undefined
    if (!deleteBtn || deleteBtn.innerText !== 'Delete workflow run') {
        throw new Error('Cannot find delete workflow button')
    }

    console.info(DEFINE.NAME, 'Clicking deleteBtn', deleteBtn)
    deleteBtn.click()

    const dialog = await waitForSelector(menu, 'details-dialog')
    const confirmBtn = await waitForSelector(dialog, 'button.btn-danger') as HTMLButtonElement
    if (confirmBtn.innerText !== 'Yes, permanently delete this workflow run') {
        throw new Error('Cannot find confirmation btn in dialog')
    }

    // Clicking confirmBtn will refresh the page
    // This will run any cleanup tasks before page gets refreshed
    await onBeforeDelete?.()

    console.info(DEFINE.NAME, 'Clicking confirmBtn', confirmBtn)
    confirmBtn.click()
}
