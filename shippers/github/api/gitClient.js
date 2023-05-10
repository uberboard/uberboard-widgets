const https = require('https')


class GitClient {

    constructor(config) {
        this.config = config
    }

    getWorkflows = (repoFullName) => {
        console.log("Retrieving workflow for", repoFullName)
        const requestOptions = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${repoFullName}/actions/workflows`,
            headers: {
                Authorization: `Bearer ${this.config.token}`,
                'User-Agent': 'uberboard-dashboard/1.0.0'
            },
            rejectUnauthorized: false,
            requestCert: false
        }
        return new Promise((resolve, reject) => {
            https.get(requestOptions,  resp => {
                this.#parseResponse(resp, resolve, reject)
            })
        })

    }

    getLatestWorkflowRun = (repoFullName, workflowId) => {
        const path = `/repos/${repoFullName}/actions/workflows/${workflowId}/runs?per_page=1`
        console.log("Retrieving latest workflow run for", path)
        const requestOptions = {
            hostname: 'api.github.com',
            port: 443,
            path,
            headers: {
                Authorization: `Bearer ${this.config.token}`,
                'User-Agent': 'uberboard-dashboard/1.0.0',
                Accept: 'application/vnd.github+json'
            },
            rejectUnauthorized: false,
            requestCert: false
        }
        return new Promise((resolve, reject) => {
            https.get(requestOptions,  resp => {
                this.#parseResponse(resp, resolve, reject)
            })
        })
    }

    getOrgRepositories = (org) => {
        console.log("Retrieving all Github repos for organization", org)
        const requestOptions = {
            hostname: 'api.github.com',
            port: 443,
            path: `/orgs/${org}/repos`,
            headers: {
                Authorization: `Bearer ${this.config.token}`,
                'User-Agent': 'uberboard-dashboard/1.0.0'
            },
            rejectUnauthorized: false,
            requestCert: false
        }
        return new Promise((resolve, reject) => {
            https.get(requestOptions,  resp => {
                this.#parseResponse(resp, resolve, reject)
            })
        })
    }

    #parseResponse = (resp, resolve, reject) => {
        const { statusCode } = resp;
        if (statusCode !== 200) {
            const error = new Error(`Request to ${resp.req.path} failed. Status Code: ${statusCode}`)
            // Consume response data to free up memory
            resp.resume();
            reject(error);
        }
        let data = ''
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('error', (error) => {
            reject(new Error(error))
        })

        resp.on('end', () => {
            resolve(JSON.parse(data))
        });
    }
}



module.exports = {
    GitClient
}