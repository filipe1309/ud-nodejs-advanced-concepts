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

### Performance test

```sh
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

### PM2

```sh
npm i pm2 -g
pm2 start index.js -i 0 # 0 = max number of cores
pm2 list
pm2 monit
pm2 show index
pm2 delete index
```

### Worker Threads

```sh
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

### Redis

```sh
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

### Chromium

```sh
brew install chromium --no-quarantine

npm run test
```

### Cookie-based Authentication

```sh
node
> const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjQ3YmVkNTdkOTIxZGFiZDViMTljNzdmIn19'; # from browser set-cookie(session)
> Buffer.from(session, 'base64').toString('utf8')
'{"passport":{"user":"647bed57d921dabd5b19c77f"}}'
```

### Session Signatures

```sh
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

https://www.reddit.com/r/MacOS/comments/q9d772/homebrew_chromium_is_damaged_and_cant_be_openend/
https://github.com/puppeteer/puppeteer/issues/5662


## Section 6 - Wiring Up Continuous Integration

https://www.travis-ci.com/

https://github.com/features/actions

## Section 7 - Scalable Image/File Upload

### AWS S3

https://aws.amazon.com/s3/

https://aws.amazon.com/sdk-for-node-js/

```sh
npm i aws-sdk
```

```sh
npm i uuid
```

Exemple
```json
// http://localhost:3001/api/upload

{
  "key": "647bed57d921dabd5b19c77f/40aaffb0-12d0-11ee-9775-09e367669407.jpeg",
  "url": "https://my-blog-bucket-13.s3.amazonaws.com/647bed57d921dabd5b19c77f/40aaffb0-12d0-11ee-9775-09e367669407.jpeg?AWSAccessKeyId=MY_ACCESS_KEY&Content-Type=image%2Fjpeg&Expires=1687640514&Signature=..."
}
```

### CORS Configuration for AWS S3

https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors-configuration.html

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT"
        ],
        "AllowedOrigins": [
            "http://localhost:3000"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```

### Bucket Policy for AWS S3

https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-iam-policies.html

AWS Policy Generator

Type of Policy: S3 Bucket Policy
Effect: Allow
Principal: *
Actions: GetObject
ARN: arn:aws:s3:::my-blog-bucket-13/*

```json
{
    "Version": "2012-10-17",
    "Id": "Policy1687643022266",
    "Statement": [
        {
            "Sid": "Stmt1687642706925",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::my-blog-bucket-13/*"
        }
    ]
}
```

Bonus!
Interested in some of my other courses? Try one out now!

React Testing Library and Jest: The Complete Guide - https://www.udemy.com/course/react-testing-library-and-jest/?couponCode=526E07745B1FC-BONUS

Redis: The Complete Developer's Guide - https://www.udemy.com/course/redis-the-complete-developers-guide-p/?couponCode=9D04C069F9-BONUS

NestJS: The Complete Developer's Guide - https://www.udemy.com/course/nestjs-the-complete-developers-guide/?couponCode=D406B3C5F99-BONUS

Microservices with Node JS and React - https://www.udemy.com/course/microservices-with-node-js-and-react/?couponCode=4641584311-BONUS

Docker and Kubernetes: The Complete Guide - https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/?couponCode=31AB06A8F178-BONUS

Go: The Complete Developer's Guide (Golang) - https://www.udemy.com/course/go-the-complete-developers-guide/?couponCode=C5FBE7A9F450-BONUS

Modern React with Redux [2023 Update] - https://www.udemy.com/course/react-redux/?couponCode=435CDC158F05-BONUS

Typescript: The Complete Developer's Guide - https://www.udemy.com/course/typescript-the-complete-developers-guide/?couponCode=6565485C3A7-BONUS

React and TypeScript: Build a Portfolio Project - https://www.udemy.com/course/react-and-typescript-build-a-portfolio-project/?couponCode=15E4C794E4F9-BONUS

Microfrontends with React: A Complete Developer’s Guide - https://www.udemy.com/course/microfrontend-course/?couponCode=6831DF9D94A-BONUS

SQL and PostgreSQL: The Complete Developer's Guide - https://www.udemy.com/course/sql-and-postgresql/?couponCode=B46F63116D-BONUS
