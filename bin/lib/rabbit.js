const https = require('https');
const axios = require('axios');
const conf = require('./conf');

const POTOCOL = "https";
const HOST = conf().host;
const PORT = conf().port;

const URI = `${POTOCOL}://${HOST}:${PORT}`;

const http = axios.create({
    baseURL: URI,
    timeout: 5000,
    auth:{
        username: conf().username,
        password: conf().password
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

function createVirtualHost(name){
    const url = `${URI}/api/vhosts/${name}`;
    return http.put(url).then(res=>{
        console.log('Done!');
    }, rej=>{
        console.log(`Error: ${rej}`);
    })
}
 

module.exports = {
    createVirtualHost: createVirtualHost
}