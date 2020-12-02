const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const  generator = require('generate-password');

const naming = require('./naming');
const config = require('./config');
const { bindingExchanges } = require('./rabbit');

function passwordGenerator(){
    return generator.generate({
        length: 32,
        numbers: true
    });
}

function dispatcher(filename){
    if(!fs.existsSync(filename)){
        console.log(`${filename} cannot be found.`);
        process.exit(1);
    }
    const content = fs.readFileSync(filename).toString();
    const obj = yaml.parse(content);
    switch(obj.kind){
        case "application":
            return applyApplication(obj);
        case "subscription":
            return applySubscription(obj);
    }
}

function applyApplication(obj){
    const rabbit = require('./rabbit');
    const name = naming(obj.name);
    
    return new Promise((resolve, reject)=>{
        rabbit.createVirtualHost(name.app.vhost).then(async res=>{
            const queueTemplate = rabbit.templates.QueueTemplate();
            const queuePromise = await rabbit.createQueue(name.app.vhost, name.app.queue, queueTemplate);

            const senderTemplate = rabbit.templates.ExchangeTemplate("fanout");
            const senderPromise = await rabbit.createExchange(name.app.vhost, name.app.exchanges.sender, senderTemplate);

            const receiverTemplate = rabbit.templates.ExchangeTemplate("fanout");
            const receiverPromise = await rabbit.createExchange(name.app.vhost, name.app.exchanges.receiver, receiverTemplate);

            const bindingTemplate = rabbit.templates.BindingTemplate();
            const bindingPromise = await rabbit.bindingExchangeToQueue(name.app.vhost, name.app.exchanges.receiver, name.app.queue, bindingTemplate);
        
            const dispatcherTemplate = rabbit.templates.ExchangeTemplate("fanout");
            const dispatcherPromise = await rabbit.createExchange(name.core.vhost, name.core.exchanges.dispatcher, dispatcherTemplate);

            const inboundTemplate = rabbit.templates.ShovelTemplate(name.core.shovels.inbound, name.app.vhost, name.app.exchanges.sender, name.core.vhost, name.core.exchanges.receiver);
            const inboundPromise = await rabbit.createShovel(name.core.vhost, name.core.shovels.inbound, inboundTemplate);

            const outboundTemplate = rabbit.templates.ShovelTemplate(name.core.shovels.outbound, name.core.vhost, name.core.exchanges.dispatcher, name.app.vhost, name.app.exchanges.receiver);
            const outboundPromise = await rabbit.createShovel(name.core.vhost, name.core.shovels.outbound, outboundTemplate);

            const username = `cpds.tx_router.${obj.name}`
            const password = passwordGenerator();
            const userPromise = await rabbit.createUser(username, password, "");

            const permissionTemplate = rabbit.templates.PermissionTemplate(username, name.app.vhost);
            const permissionPromise = await rabbit.createPermission(name.app.vhost, username, permissionTemplate);

            Promise.all([
                queuePromise, 
                senderPromise,
                receiverPromise,
                bindingPromise,
                dispatcherPromise,
                inboundPromise,
                outboundPromise,
                userPromise,
                permissionPromise
            ]).then(res=>{
                console.log("")
                console.log(`User has been created for app ${obj.name}:`)
                console.log("  =================================================")
                console.log(`   username: ${username}`);
                console.log(`   password: ${password}`);
                console.log("  =================================================")
                console.log("")
                resolve();
            }, rej=>{
                reject(rej);
            }).catch(err=>{
                reject(err);
            })

        }, rej=>{
            reject(rej);
        }).catch(err=>{
            reject(err);
        })
    })
    
}

async function applySubscription(obj){
    const rabbit = require('./rabbit');
    const name = naming(obj.name);

    const promiseArray = [];
    obj.subscriptions && obj.subscriptions.forEach(item => {
        console.log(item);
        const subscribeTemplate = rabbit.templates.BindingTemplate();
        subscribeTemplate.arguments['from'] = item.from;
        subscribeTemplate.arguments['topic'] = item.eventId;

        var subscribePromise = rabbit.bindingExchanges(name.core.vhost, name.core.exchanges.receiver, name.core.exchanges.dispatcher, subscribeTemplate);
        promiseArray.push(subscribePromise);
    });

    return await Promise.all(promiseArray);
}

module.exports = dispatcher;