process.env.UV_THREADPOOL_SIZE = 5; // default is 4

const crypto = require('crypto');

const start = Date.now();

// libuv will handle the requests in the thread pool
crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', () => {
    console.log('1:', Date.now() - start);
});

crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', () => {
    console.log('2:', Date.now() - start);
});

crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', () => {
    console.log('3:', Date.now() - start);
});

crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', () => {
    console.log('4:', Date.now() - start);
});

crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', () => {
    console.log('5:', Date.now() - start);
});
