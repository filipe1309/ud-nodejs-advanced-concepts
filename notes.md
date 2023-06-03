# Notes

> notes taken during the course

## Section 2

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
