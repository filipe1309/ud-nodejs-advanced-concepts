const moongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get); // this is a way to transform a callback function into a promise based function
const exec = moongoose.Query.prototype.exec;


moongoose.Query.prototype.cache = function () {
    this.useCache = true;
    return this;
}

// Monkey patching the exec function
moongoose.Query.prototype.exec = async function () {
    console.log('IM ABOUT TO RUN A QUERY');
    console.log('getQuery', this.getQuery());
    console.log('collection', this.mongooseCollection.name);

    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    // const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    //     collection: this.mongooseCollection.name
    // }));

    const key = JSON.stringify({
        ...this.getQuery(),
        collection: this.mongooseCollection.name
    });

    console.log('key', key);

    // See if we have a value for 'key' in redis
    const cacheValue = await client.get(key);

    // If we do, return that
    if (cacheValue) {
        console.log('------------------------------------');
        console.log('cacheValue', cacheValue);
        console.log('------------------------------------');

        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis

    const result = await exec.apply(this, arguments);
    console.log('result', result);
    client.set(key, JSON.stringify(result), 'EX', 10);
    return result;
}
