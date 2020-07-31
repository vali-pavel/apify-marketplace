const Apify = require('apify');

const {
    runTask,
    getDatasetItems,
} = require('./apifyService');
const { waitForRunToFinish } = require('./utils');
const { validateInput } = require('./validateInput');
const { TASK_ID } = require('./constants');

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
