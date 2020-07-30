const Apify = require('apify');

const {
    runTask,
    getRun,
    getDatasetItems,
} = require('./apifyService');
const { validateInput } = require('./validateInput');

const BASE_URL = 'https://www.amazon.com';
const TASK_ID = '39DdtqVBrBm7u5rDN';
const INTERVAL = 5000;

const waitForRunToFinish = async ({ id, actId }) => {
    let taskRunning = true;
    while(taskRunning) {
        const runMetaData = {
            id,
            actId,
        };
        const { status } = await getRun(runMetaData);

        if(status === 'SUCCEEDED') {
            taskRunning = false;
        } else if(status === 'FAILED' || status === 'ABORTED') {
            throw new Error('Task failed to run successfully');
        }
        await Apify.utils.sleep(INTERVAL);
    }
}

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');
    validateInput(input);

    const {
        memory,
        useClient,
        maxItems,
        fields,
    } = input;

    const taskMetaData = {
        memory,
        useClient,
        taskId: TASK_ID,
    }
    const run = await runTask(taskMetaData);

    await waitForRunToFinish(run, useClient);

    const datasetMetaData = {
        datasetId: run.defaultDatasetId,
        fields,
        maxItems,
    }
    const datasetItems = await getDatasetItems(datasetMetaData);
    await Apify.setValue(
        'OUTPUT',
        datasetItems,
        {
            contentType: 'text/csv'
        }
    );
});
