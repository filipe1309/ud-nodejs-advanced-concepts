const Buffer = require('safe-buffer').Buffer
const Keygrip = require('keygrip');
const keys = require('../../config/keys');

const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
    // Generate Session
    let sessionObject = { "passport": { "user": user._id.toString() } };
    session = Buffer
        .from(JSON.stringify(sessionObject))
        .toString('base64');

    // Generate Session Sig
    const sig = keygrip.sign(`session=${session}`);

    return { session, sig }
};
