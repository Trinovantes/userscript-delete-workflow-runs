export function isOnWorkflowsPage(location: Location): boolean {
    // https://github.com/Trinovantes/userscript-delete-workflow-runs/actions
    const re = /^https:\/\/github.com\/([\w-]+)\/([\w-]+)\/actions$/
    return re.test(location.href)
}
