const {GitClient} = require('./api/gitClient')

let client
function init(widgetConfig) {
    client = new GitClient({
        token: widgetConfig.github.token
    })

}

async function render(callback, widgetConfig) {
    try {
        callback({
            org: widgetConfig.github.org,
            workflows: []
        })
        const repos = await client.getOrgRepositories(widgetConfig.github.org)

        let allWorkflowRuns = []
        for(const repo of repos) {
            const workflowResponse = await client.getWorkflows(repo.full_name)
            for (const workflow of workflowResponse.workflows) {
                const workflowRunsResponse = await client.getLatestWorkflowRun(repo.full_name, workflow.id)
                const workflowRuns = workflowRunsResponse.workflow_runs.map(wf => ({
                    id: wf.id,
                    workflowId: wf.workflow_id,
                    name: wf.name,
                    commit: wf.head_commit,
                    actor: wf.actor,
                    status: wf.status,
                    conclusion: wf.conclusion,
                    repo: wf.repository
                }))
                allWorkflowRuns = allWorkflowRuns.concat(workflowRuns)
                if (widgetConfig.showSucceeded === false) {
                    allWorkflowRuns = allWorkflowRuns.filter(wf => wf.conclusion !== 'success')
                }
            }

        }

        callback({
            org: widgetConfig.github.org,
            workflows: allWorkflowRuns
        })
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    init: init,
    default: render
}