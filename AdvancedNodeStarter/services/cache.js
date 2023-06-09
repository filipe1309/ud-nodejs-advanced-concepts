const moongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget); // this is a way to transform a callback function into a promise based function
const exec = moongoose.Query.prototype.exec;


moongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
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
    const cacheValue = await client.hget(this.hashKey, key);

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
    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
    return result;
}

module.exports = {
    clearHash (hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}
