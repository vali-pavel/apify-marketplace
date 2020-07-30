const ApifyClient = require('apify-client');
const Apify = require('apify');
const request = require('request');

const {
    userId,
    token
} = require('./config');

const APIFY_BASE_URL = 'https://api.apify.com/v2';

const initializeApifyClient = () => {
    return new ApifyClient({
        userId,
        token,
    });
}

const runTask = async ({
    memory,
    useClient,
    taskId,
}) => {
    if(useClient) {
        const apifyClient = initializeApifyClient();
        return await apifyClient.tasks.runTask({
            taskId,
            token,
            memory,
        });
    } else {
        const url = `${APIFY_BASE_URL}/actor-tasks/${taskId}/runs?token=${token}&memory=${memory}`;
        const options = {
            'method': 'POST',
            'headers': {
                'accept': 'application/json',
                'content-type': 'application/json',
            },
            'json': true,
            'url': url
        }

        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if(response.statusCode === 201) {
                    resolve(body.data);
                } else {
                    reject(error);
                }
            });
        });
    }
}

const getRun = async ({
    id,
    actId,
}) => {
    const apifyClient = initializeApifyClient();
    return await apifyClient.acts.getRun({
        actId,
        token,
        runId: id,
    });
}

const getDatasetItems = async ({
    datasetId,
    maxItems,
    fields,
}) => {
    const apifyClient = initializeApifyClient();
    const { items } = await apifyClient.datasets.getItems({
        datasetId,
        fields,
        format: 'csv',
        limit: maxItems,
    });
    return items;
}

module.exports = {
    runTask,
    getRun,
    getDatasetItems,
}
