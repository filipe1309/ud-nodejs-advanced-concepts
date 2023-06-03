process.env.UV_THREADPOOL_SIZE = 1; // default is 4

const cluster = require('cluster');

// Is the file being executed in master mode?
if (cluster.isMaster) {
    console.log('Master mode');
    // Cause index.js to be executed *again* but in child mode
    cluster.fork();
    cluster.fork();
} else {
    const express = require('express');
    const crypto = require('crypto');
    const app = express();

    console.log('Child mode');

    // function doWork (duration) {
    //     const start = Date.now();
    //     while (Date.now() - start < duration) { }
    // }

    app.get('/', (req, res) => {
        // doWork(5000); // 5 seconds
        crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', () => {
            res.send('Hi there!');
        });
    });

    app.get('/fast', (req, res) => {
        res.send('This was fast!');
    });

    app.listen(3000);
}
