const express = require('express');
const { Worker } = require('worker_threads');
const app = express();

app.get('/', (req, res) => {
    const worker = new Worker('./worker.js');

    worker.on('message', (msg) => {
        console.log('InMainThread | Worker msg: ' + msg);
        res.send('InMainThread | Worker msg: ' + msg);
    });

    worker.postMessage('start');
});

app.listen(3000);
