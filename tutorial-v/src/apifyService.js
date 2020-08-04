const Apify = require('apify');
const request = require('request');

const { APIFY_BASE_URL } = require('./constants');

const {
    userId,
    token
} = require('./config');

const runTask = async ({
    memory,
    useClient,
    taskId,
}) => {
    if(useClient) {
        return await Apify.client.tasks.runTask({
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
    return await Apify.client.acts.getRun({
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
    const { items } = await Apify.client.datasets.getItems({
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
