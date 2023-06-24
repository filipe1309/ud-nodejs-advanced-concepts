const aws = require('aws-sdk');
const keys = require('../config/keys');

const s3 = new aws.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: 'us-east-1',
});

module.exports = app => {
  app.get('/api/upload', (req, res) => {
    res.send({ hi: 'there' });
  });
}
