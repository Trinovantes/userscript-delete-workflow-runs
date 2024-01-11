import { findDelayedElement } from './findDelayedElement'

export async function deleteWorkflowRun(numWorkflowRunsToKeep: number, onBeforeDelete?: () => Promise<void>) {
    const container = await findDelayedElement('#partial-actions-workflow-runs')
    const actionBtns = container.querySelectorAll('summary.timeline-comment-action')

    // Check if there is an N+1 btn
    const numWorkflows = actionBtns.length
    if (numWorkflowRunsToKeep >= numWorkflows) {
        console.info(DEFINE.NAME, `Finished numWorkflows:${numWorkflows} numWorkflowRunsToKeep:${numWorkflowRunsToKeep}`)
        return true
    }

    const actionBtn = actionBtns[numWorkflowRunsToKeep] as HTMLButtonElement
    const actionContainer = actionBtn.parentElement
    if (!actionContainer) {
        throw new Error('Cannot find parent of actionBtn')
    }

    clickBtn('actionBtn', actionBtn)

    const menu = await findDelayedElement('ul.dropdown-menu', actionContainer)
    const deleteBtn = await findDelayedElement('button.menu-item-danger', menu)
    if (deleteBtn.innerText !== 'Delete workflow run') {
        throw new Error('Cannot find delete workflow button')
    }

    clickBtn('deleteBtn', deleteBtn)

    const dialog = await findDelayedElement('modal-dialog', menu)
    const confirmBtn = await findDelayedElement('button.Button--danger', dialog)
    if (confirmBtn.innerText !== 'Yes, delete this workflow run') {
        throw new Error('Cannot find confirmation btn in dialog')
    }

    // Clicking confirmBtn will refresh the page
    // This will run any cleanup tasks before page gets refreshed
    await onBeforeDelete?.()

    clickBtn('confirmBtn', confirmBtn)
    return false
}

function clickBtn(btnName: string, btn: HTMLElement) {
    console.groupCollapsed(DEFINE.NAME, 'Clicking', btnName)
    console.info(btn)
    btn.click()
    console.groupEnd()
}
