import { waitForSelector } from '@/utils/waitForSelector'

export async function deleteWorkflowRuns(numWorkflowRunsToKeep: number, onBeforeDelete?: () => Promise<void>): Promise<void> {
    const container = await waitForSelector(document, '#partial-actions-workflow-runs')
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

    const menu = await waitForSelector(parent, 'ul.dropdown-menu')
    const deleteBtn = await waitForSelector<HTMLButtonElement>(menu, 'summary.menu-item-danger')
    if (deleteBtn.innerText !== 'Delete workflow run') {
        throw new Error('Cannot find delete workflow button')
    }

    console.info(DEFINE.NAME, 'Clicking deleteBtn', deleteBtn)
    deleteBtn.click()

    const dialog = await waitForSelector(menu, 'details-dialog')
    const confirmBtn = await waitForSelector<HTMLButtonElement>(dialog, 'button.btn-danger')
    if (confirmBtn.innerText !== 'Yes, permanently delete this workflow run') {
        throw new Error('Cannot find confirmation btn in dialog')
    }

    // Clicking confirmBtn will refresh the page
    // This will run any cleanup tasks before page gets refreshed
    await onBeforeDelete?.()

    console.info(DEFINE.NAME, 'Clicking confirmBtn', confirmBtn)
    confirmBtn.click()
}
