const {table} = require('table');

function getApplications(){
    const rabbit = require('./rabbit');
    const naming = require('./naming')();
    return new Promise((resolve, reject) => {
        rabbit.getDefinitions().then(res => {
            const data = res.data;
            const vhosts = data.vhosts || [];
            const arr = [];
            arr.push(['Applications']);
            for(var i=0; i<vhosts.length; i++){
                const clips = vhosts[i].name.split(".");
                if(clips.length == 2 && clips[0] === 'cpds'){
                    var v_name = vhosts[i].name.split(".")[1];
                    v_name != naming.core.vhost.split(".")[1] &&  arr.push([v_name])
                }
            }
            console.log(table(arr));
            resolve();
        }, rej=>{
            reject(rej);
        }).catch(err=>{
            reject(err);
        })
    });
}

function getSubscriptions(){
    const rabbit = require('./rabbit');
    const naming = require('./naming')();
    return new Promise((resolve, reject) => {
        rabbit.getDefinitions().then(res => {
            const data = res.data;
            const bindings = data.bindings || [];
            const arr = [];
            arr.push(['Source', 'Destination', 'EventID']);
            bindings.forEach(bind => {
                if(bind.vhost == naming.core.vhost){
                    const destClip = bind.destination.split('.');
                    if(bind.source == naming.core.exchanges.receiver && destClip.length === 3 && destClip[2] === 'dispatcher'){
                        const srcSys = bind.arguments.from;
                        const destSys = destClip[1];
                        const eventId = bind.arguments.topic;
                        arr.push([srcSys, destSys, eventId]);
                    }
                }
            })
            console.log('\n-- Subscriptions --');
            console.log(table(arr));
            resolve();
        }, rej => {
            reject(rej);
        }).catch(err => {
            reject(err);
        })
    })
}

module.exports = function(kind){
    switch(kind){
        case "applications":
            return getApplications();
        case "subscriptions":
            return getSubscriptions();
    }
}
