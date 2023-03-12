const JiraApi = require('jira-client')

let jira

function init(config) {
    jira = new JiraApi(config.jira);
}

function render(callback) {
    jira.findIssue("MLEY-123").then(issue => {
        callback({
            text: issue.fields.summary
        })
    }).catch(e => console.error(e));
}

module.exports = {
    default: render,
    init: init,
}

