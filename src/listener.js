const amqplib = require('amqplib');
const has = require('has-value');
const conf = require('../conf/config');

const Listener = {
    mapper: {},
    listen: function (appid, structure) {
        if(!has(Listener.mapper, appid)){
            Listener.mapper[appid] = {};
        }
        for(let topic in structure){
            if(has(Listener.mapper[appid], topic)){
                throw new Error(`duplicate declared application topics: app=${appid}, topic=${topic}.`);
            }else{
                Listener.mapper[appid][topic] = structure[topic];
            }
        }
    }
};

(function run() {
    amqplib.connect(conf.URL, conf.OPTS)
        .then(conn => conn.createChannel())
        .then(ch => ch.assertQueue('inbox')
            .then(() => ch.consume('inbox', msg => {
                if( has(msg, 'properties.headers.from') && 
                    has(msg, 'properties.headers.topic') && 
                    has(Listener.mapper, msg.properties.headers.from) &&
                    has(Listener.mapper[msg.properties.headers.from], msg.properties.headers.topic)
                ){
                    var rs = Listener.mapper[msg.properties.headers.from][msg.properties.headers.topic](msg.content, msg.properties.headers.traceId);
                    if(rs === true){
                        ch.ack(msg);
                    }
                }
            }))
        ).catch(console.warn)
})();

module.exports = Listener;