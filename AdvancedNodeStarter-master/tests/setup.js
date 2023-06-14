jest.setTimeout(60000); // default 5000ms

require('../models/User');
const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

afterAll(async () => { await mongoose.disconnect() });
