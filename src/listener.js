const amqplib = require('amqplib');
const has = require('has-value');
const fs = require('fs');

const CONFIG = {
    URL: {
        protocol: process.env['TXROUTER.PROTOCOL'] || "amqps",
        hostname: process.env['TXROUTER.HOST'] || "localhost",
        port: Number(process.env['TXROUTER.PORT']) || 15672,
        username: process.env['TXROUTER.USERNAME'] || "guest",
        password: process.env['TXROUTER.PASSWORD'] || "guest",
        locale: 'en_US.UTF-8',
        frameMax: 0,
        heartbeat: 0,
        vhost: `cpds.${process.env['TXROUTER.APPID'] || 'UNAUTH'}`
    },
    OPTS: {
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

const Listener = {
    mapper: {},
    listen: function (appid, structure) {
        if(!has(this.mapper, appid)){
            this.mapper[appid] = {};
        }
        for(let topic in structure){
            if(has(this.mapper[appid], topic)){
                throw new Error(`duplicate declared application topics: app=${appid}, topic=${topic}.`);
            }else{
                this.mapper[appid][topic] = structure[topic];
            }
        }
    }
};

(function run() {
    amqplib.connect(CONFIG.URL, CONFIG.OPTS)
        .then(conn => conn.createChannel())
        .then(ch => ch.assertQueue('inbox')
            .then(() => ch.consume('inbox', msg => {
                if( has(msg, 'properties.headers.from') && 
                    has(msg, 'properties.headers.topic') && 
                    has(Listener.mapper, msg.properties.headers.from) &&
                    has(Listener.mapper[msg.properties.headers.from], msg.properties.headers.topic)
                ){
                    Listener.mapper[msg.properties.headers.from][msg.properties.headers.topic](msg.content);
                    ch.ack(msg);
                }
            }))
        ).catch(console.warn)
})();

module.exports = Listener;