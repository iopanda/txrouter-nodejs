const amqplib = require('amqplib');
const fs = require('fs');

const HOST = "6e4a1d1c-2de3-470d-b40c-233ac59d640c.bn2a2vgd01r3l0hfmvc0.databases.appdomain.cloud:30159";
const USERNAME = "admin";
const PASSWORD = "wsewsewsewsewse";

const opts = {
    cert: fs.readFileSync('cert/cacert.pem'),
    key: fs.readFileSync('cert/key.pem'),
    passphrase: "password",
    ca: [fs.readFileSync('cert/040ed05a-0600-11ea-9c10-3a7a49ce7011')]
};

const url = {
    protocol: "amqps",
    hostname: "6e4a1d1c-2de3-470d-b40c-233ac59d640c.bn2a2vgd01r3l0hfmvc0.databases.appdomain.cloud",
    port: 30159,
    username: "admin",
    password: "wsewsewsewsewse",
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: 'cpds.cot'
}
let open = amqplib.connect(`amqps://${USERNAME}:${PASSWORD}@${HOST}/cpds.cot`, opts);
// let open = amqplib.connect(url, opts);

open.then(function(conn){
    return conn.createChannel();
}).then(function(ch){
    return ch.assertQueue('inbox').then(function(ok){
        return ch.consume('inbox', function(msg){
            console.log(msg);
            ch.ack(msg);
        })
    })
}).catch(console.warn)