const fs = require('fs');

const CONFIG = {};

CONFIG.APP = {
    appid: process.env['TXROUTER.APPID']
};

CONFIG.URL = {
    protocol: process.env['TXROUTER.PROTOCOL'] || "amqps",
    hostname: process.env['TXROUTER.HOST'] || "localhost",
    port: Number(process.env['TXROUTER.PORT']) || 5672,
    username: process.env['TXROUTER.USERNAME'] || "guest",
    password: process.env['TXROUTER.PASSWORD'] || "guest",
    locale: 'en_US.UTF-8',
    frameMax: 0,
    heartbeat: 0,
    vhost: `cpds.${process.env['TXROUTER.APPID'] || 'UNAUTH'}`
};

if(CONFIG.URL.protocol === 'amqps'){
    CONFIG.OPTS = {
        cert: fs.readFileSync(
            process.env['TXROUTER.CERT.CLIENT'] || 'cert/client.pem'
        ),
        key: fs.readFileSync(
            process.env['TXROUTER.CERT.KEY'] || 'cert/key.pem'
        ),
        passphrase: process.env['TXROUTER.CERT.PASSPHRASE'] || "password",
        ca: [
            fs.readFileSync(
                process.env['TXROUTER.CERT.CA'] || 'cert/ca.pem')
            ]
    }
}

module.exports = CONFIG;