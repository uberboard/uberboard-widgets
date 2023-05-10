let bb = require('bitbucket')

let config
let bitbucket

function init(widgetConfig) {
    config = widgetConfig
    bitbucket = new bb.Bitbucket({
        baseUrl: widgetConfig.apiUrl,
        auth: widgetConfig.auth
    })
}

async function getPipelineResults() {

    let repositoryData = []
    if (!config.repositories || config.repositories.length <= 0) {
        const result = await bitbucket.repositories.list({
            workspace: config.workspace,
            pagelen: 50,
            fields: "values.type,values.slug"
        })
        repositoryData = result?.data.values
    } else {
        for (const repoSlug of config.repositories) {
            repositoryData.push({
                type: 'repository',
                slug: repoSlug
            })
        }
    }

    let pipelines = []
    for (const repo of repositoryData) {
        if (repo.type === 'repository') {
            const pipelineResult = await bitbucket.pipelines.list({
                repo_slug: repo.slug,
                workspace: config.workspace,
                sort: "-created_on",
                pagelen: 1,
                fields: "values.state,values.repository.name,values.build_number,values.result"
            })
            let pipeline = pipelineResult?.data?.values && pipelineResult?.data?.values[0]
            if (!pipeline) {
                console.error("No data for", repo.slug)
            }
            if (!!pipeline && pipeline.state?.result?.name !== 'SUCCESSFUL') {
                pipelines.push(pipeline)
            }
        }
    }
    return pipelines
}

function render(callback) {
    getPipelineResults().then(pipelines => {
        callback({
            pipelines: pipelines
        })
    }).catch(e => console.error(e))
}


module.exports = {
    init: init,
    default: render
}