import core from '@actions/core';
import fetch from 'node-fetch';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    try {
        const url = core.getInput('url');
        const responseCode = core.getInput('response-code');
        const timeout = core.getInput('timeout');
        const interval = core.getInput('interval');
        const start = new Date();
        
        var end = new Date();

        console.log(`Polling ${url} every ${interval} seconds until it returns a response code of ${responseCode}`);

        var timeoutDuration = timeout * 1000;
        var intervalDuration = interval * 1000;

        while (true) {
            var status;
            end = new Date();

            const response = await fetch(url).then(res => status = res.status).catch(err => status = 404);
            const duration = end.getTime() - start.getTime();

            if (response.status == responseCode) {
                console.log(`Polling completed in ${duration}ms`);
                return 0;
            } else {
                console.log(`Polling failed with status ${status}, retrying in ${interval} second(s)`);
            }

            if (duration > timeoutDuration) {
                console.log(`Polling timed out after ${timeout} seconds`);
                return 1;
            }

            await sleep(intervalDuration);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();