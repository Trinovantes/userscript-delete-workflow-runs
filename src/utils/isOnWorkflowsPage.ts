export function isOnWorkflowsPage(url: string): boolean {
    // https://github.com/Trinovantes/userscript-delete-workflow-runs/actions
    const re = /^https:\/\/github.com\/([\w-]+)\/([\w-]+)\/actions$/
    return re.test(url)
}
