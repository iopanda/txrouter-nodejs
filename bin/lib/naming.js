
module.exports = function(name){
    return {
        app: {
            vhost: `cpds.${name}`,
            queue: `inbox`,
            exchanges: {
                sender: `cpds.${name}.sender`,
                receiver: `cpds.${name}.receiver`
            },
            username: `cpds.tx_router.${name}`
        },
        core: {
            vhost: `cpds.tx_router`,
            exchanges: {
                receiver: `cpds.tx_router.receiver`,
                dispatcher: `cpds.${name}.dispatcher`
            },
            shovels: {
                inbound: `cpds.txrouter.inbound.${name}`,
                outbound: `cpds.txrouter.outbound.${name}`
            }
        }
    }
}