
function initTxRouter() {
    const rabbit = require('./rabbit');

    const vhost = 'cpds.tx_router';
    const exchange = 'cpds.tx_router.receiver'
    return new Promise((resolve, reject) => {
        rabbit.createVirtualHost(vhost).then(res => {
            const body = rabbit.templates.ExchangeTemplate("headers");
            rabbit.createExchange(vhost, exchange, body).then(res => {
                resolve(res);
            }, rej => {
                reject(rej);
            })
        }, rej => {
            reject(rej);
        })
    });
}

module.exports = {
    initTxRouter: initTxRouter
}