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
