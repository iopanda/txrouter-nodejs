const https = require('https');
const axios = require('axios');
const config = require('./config').loadConfig();

const URI = `${config.protocal}://${config.host}:${config.port}`;

const http = axios.create({
    baseURL: URI,
    timeout: 5000,
    auth: {
        username: config.username,
        password: config.password
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

function createVirtualHost(vhost) {
    const url = `/api/vhosts/${vhost}`;
    return http.put(url);
}

function createExchange(vhost, exchange, data) {
    const url = `/api/exchanges/${vhost}/${exchange}`;
    return http.put(url, data);
}

function createQueue(vhost, queue, data) {
    const url = `/api/queues/${vhost}/${queue}`;
    return http.put(url, data);
}

function createShovel(vhost, shovel, data) {
    const url = `/api/parameters/shovel/${vhost}/${shovel}`;
    return http.put(url, data);
}

function bindingExchanges(vhost, from, to, data) {
    const url = `/api/bindings/${vhost}/e/${from}/e/${to}`;
    return http.post(url, data);
}

function bindingExchangeToQueue(vhost, exchange, queue, data) {
    const url = `/api/bindings/${vhost}/e/${exchange}/q/${queue}`;
    return http.post(url, data);
}

function createUser(username, password, tags) {
    const url = `/api/users/${username}`;
    return http.put(url, {
        password: password,
        tags: tags
    });
}

function createPermission(vhost, username, data) {
    const url = `/api/permissions/${vhost}/${username}`;
    return http.put(url, data);
}

const templates = {
    ExchangeTemplate: (type) => {
        return {
            "type": type,
            "auto_delete": false,
            "durable": true,
            "internal": false,
            "arguments": {}
        }
    },
    QueueTemplate: () => {
        return {
            "auto_delete": false,
            "durable": true,
            "arguments": {},
            "node": config.cluster
        }
    },
    BindingTemplate: () => {
        return {
            "routing_key": "",
            "arguments": {}
        }
    },
    ShovelTemplate: (name, vhost_from, exchange_from, vhost_to, exchange_to) => {
        return {
            "component": "shovel",
            "name": name,
            "vhost": `${vhost_from}`,
            "value": {
                "ack-mode": "on-confirm",
                "add-forward-headers": true,
                "delete-after": "never",
                "prefetch-count": 250,
                "reconnect-delay": 30,

                "src-exchange": `${exchange_from}`,
                "src-uri": `amqp://${config.username}@/${vhost_from}`,

                "dest-exchange": `${exchange_to}`,
                "dest-uri": `amqp://${config.username}@/${vhost_to}`
            }
        }
    },
    UserTemplate: (password, tags) => {
        return {
            "password": `${password}`,
            "tags": `${tags}`
        }
    },
    PermissionTemplate: (username, vhost) => {
        return {
            "user": `${username}`,
            "vhost": `${vhost}`,
            "configure":".*",
            "write":".*",
            "read":".*"
        }
    }
}

module.exports = {
    createVirtualHost: createVirtualHost,
    createExchange: createExchange,
    createQueue: createQueue,
    createShovel: createShovel,
    bindingExchanges: bindingExchanges,
    bindingExchangeToQueue: bindingExchangeToQueue,
    createUser: createUser,
    createPermission: createPermission,
    templates: templates
}