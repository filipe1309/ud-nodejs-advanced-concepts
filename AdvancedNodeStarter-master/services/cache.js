const moongoose = require('mongoose');

const exec = moongoose.Query.prototype.exec;

// Monkey patching the exec function
moongoose.Query.prototype.exec = function () {
    console.log('IM ABOUT TO RUN A QUERY');
    return exec.apply(this, arguments);
}
