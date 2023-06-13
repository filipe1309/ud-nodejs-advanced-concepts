# Notes

> notes taken during the course

https://github.com/StephenGrider/AdvancedNodeStarter

## Section 2 - Enhancing Node Performance

```sh
cd section2
npm init -y
npm i express

# run
node index.js

```

```sh
# performace test

## apache bench
ab -c 50 -n 500 localhost:3000/fast # 50 concurrent requests, 500 total requests

## 1 fork/worker, 1 libuv threads per worker
ab -c 1 -n 1 localhost:3000/ # 1 concurrent request, 1 total request
# Time taken for tests:   0.289 seconds
# Requests per second:    3.46 [#/sec] (mean)
# Time per request:       289.010 [ms] (mean)
# Time per request:       289.010 [ms] (mean, across all concurrent requests)

ab -c 2 -n 2 localhost:3000/ # 2 concurrent requests, 2 total requests
# Time taken for tests:   0.549 seconds
# Requests per second:    3.64 [#/sec] (mean)
# Time per request:       549.416 [ms] (mean)
# Time per request:       274.708 [ms] (mean, across all concurrent requests)


## 2 fork/worker, 1 libuv threads per worker
ab -c 2 -n 2 localhost:3000/ # 2 concurrent requests, 2 total requests
# Time taken for tests:   0.557 seconds
# Requests per second:    3.59 [#/sec] (mean)
# Time per request:       557.016 [ms] (mean)
# Time per request:       278.508 [ms] (mean, across all concurrent requests)

## 6 fork/worker, 1 libuv threads per worker
ab -c 6 -n 6 localhost:3000/
# Time taken for tests:   0.573 seconds
# Requests per second:    10.46 [#/sec] (mean)
# Time per request:       573.458 [ms] (mean)
# Time per request:       95.576 [ms] (mean, across all concurrent requests)

## 12 fork/worker, 1 libuv threads per worker
ab -c 12 -n 12 localhost:3000/
# Time taken for tests:   0.793 seconds
# Requests per second:    15.13 [#/sec] (mean)
# Time per request:       793.068 [ms] (mean)
# Time per request:       66.089 [ms] (mean, across all concurrent requests)

## 2 fork/worker, 1 libuv threads per worker
ab -c 6 -n 6 localhost:3000/
# Time taken for tests:   1.102 seconds
# Requests per second:    5.45 [#/sec] (mean)
# Time per request:       1101.577 [ms] (mean)
# Time per request:       183.596 [ms] (mean, across all concurrent requests)

## autocannon
npm i autocannon -g
autocannon -c 50 -d 5 -p 10 localhost:3000/fast # 50 concurrent requests, 5 seconds, 10 pipelining
```

```sh
# pm2
npm i pm2 -g
pm2 start index.js -i 0 # 0 = max number of cores
pm2 list
pm2 monit
pm2 show index
pm2 delete index
```

```sh
## Worker Threads

# Verify Worker Threads are enabled
node -e "require('worker_threads'); console.log('success');"

ab -c 1 -n 1 localhost:3000/
# Time taken for tests:   0.505 seconds
# Requests per second:    1.98 [#/sec] (mean)
# Time per request:       504.962 [ms] (mean)
# Time per request:       504.962 [ms] (mean, across all concurrent requests)

ab -c 2 -n 2 localhost:3000/
# Time taken for tests:   0.994 seconds
# Requests per second:    2.01 [#/sec] (mean)
# Time per request:       994.180 [ms] (mean)
# Time per request:       497.090 [ms] (mean, across all concurrent requests)
```

## Section 3 - Project Setup

https://github.com/StephenGrider/AdvancedNodeComplete
https://github.com/StephenGrider/AdvancedNodeStarter // New Version

```sh
# AdvancedNodeComplete - Blog App with React/Redux and Node.js
# git clone https://github.com/StephenGrider/AdvancedNodeStarter.git
cd AdvancedNodeStarter
npm i
cd client
npm i --legacy-peer-deps
cd ..
npm run dev
#localhost:3000
```

## Section 4 - Data Caching with Redis

```sh
# Redis
brew install redis
brew services start redis
redis-cli ping # PONG
redis-cli
set mynumber 10
get mynumber
incr mynumber
get mynumber
del mynumber
brew services stop redis
```

```sh
# Redis Client for Node
node
# Welcome to Node.js v19.7.0.
# Type ".help" for more information.
> const redis = require('redis');
> const redisUrl = 'redis://127.0.0.1:6379'
> const client = redis.createClient(redisUrl)

> client.set('hi', 'there')
> client.get('hi', (err, value) => console.log(value))
> client.get('hi', console.log)
```

```sh
# Redis Hashes
node
> const redis = require('redis');
> const redisUrl = 'redis://127.0.0.1:6379'
> const client = redis.createClient(redisUrl)

> client.hset('german', 'red', 'rot')
> client.hget('german', 'red', console.log)
> null rot # error, value
> client.hset('german', 'blue', 'blau')
> client.hget('german', 'blue', console.log)
> null blau # error, value
> client.hgetall('german', console.log)
> null { red: 'rot', blue: 'blau' } # error, value
```

```sh
# One Redis Gotcha
# Store objects in Redis
node
> const redis = require('redis');
> const redisUrl = 'redis://127.0.0.1:6379'
> const client = redis.createClient(redisUrl)

> client.set('colors', { color: 'rot' })
> client.get('colors', console.log)
> null '[object Object]' # error, value

# JSON.parse and JSON.stringify
node
> const redis = require('redis');
> const redisUrl = 'redis://127.0.0.1:6379'
> const client = redis.createClient(redisUrl)

> client.set('colors', JSON.stringify({ color: 'rot' }))
> client.get('colors', console.log)
> null '{"color":"rot"}' # error, value
> client.get('colors', (err, value) => console.log(JSON.parse(value)))
> null { color: 'rot' } # error, value
```

```sh
# Redis flushall
client.flushall()
```

```sh
# Redis timeout
client.set('color', 'red', 'EX', 5) # 5 seconds
client.get('color', console.log)
```

## Section 5 - Automated Headless Browser Testing

```sh
npm run test
```

```sh
# Cookie-based Authentication
node
> const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjQ3YmVkNTdkOTIxZGFiZDViMTljNzdmIn19'; # from browser set-cookie(session)
> Buffer.from(session, 'base64').toString('utf8')
'{"passport":{"user":"647bed57d921dabd5b19c77f"}}'
```

```sh
# Session Signatures
node
> const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjQ3YmVkNTdkOTIxZGFiZDViMTljNzdmIn19'; # from browser set-cookie(session)
> const Keygrip = require('keygrip')
> const keygrip = new Keygrip(['123123123'])
> keygrip.sign('session=' + session);
'TblcK5cSSGoLJrsFrtAHB9v_LVM'
> keygrip.sign('qwert' + session);
'M1putl0y9i9gq-MlCgEfLwFteOI'
> keygrip.verify('session=' + session, 'TblcK5cSSGoLJrsFrtAHB9v_LVM');
true
> keygrip.verify('session=' + session, 'TblcK5cSSGoLJrsFr');
false
```

```js
test.only(...)
```




