const Apify = require('apify');

const { getRun } = require('./apifyService');
const { RUN_CHECK_INTERVAL } = require('./constants');

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
        await Apify.utils.sleep(RUN_CHECK_INTERVAL);
    }
}

module.exports = {
    waitForRunToFinish,
}
