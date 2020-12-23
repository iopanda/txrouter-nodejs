const fs = require('fs');
const os = require('os');
const del = require('del');
const path = require('path');
const yaml = require('yaml');
const input = require('input');
const pjson = require('pjson');
const { Base64 } = require('js-base64');
const trim = require('string.prototype.trim');

async function createConfig() {
    const dp = path.join(os.homedir(), '.txrouter');
    const fp = path.join(dp, 'default.yaml');

    await del(dp, { force: true });
    const content = {
        apiVersion: pjson.version,
        kind: "configuration",
        description: "txrouter default configuration",
        name: "default",
        environments: {}
    }

    const ename = await input.text('environment name:');
    content.environments[ename] = {
        protocol: await input.select('Choose the protocol:', ['http', 'https']),
        host: await input.text('host:'),
        port: await input.text('port:'),
        cluster: await input.text('cluster:'),
        username: Base64.encode(await input.text('username:')),
        password: Base64.encode(await input.password('password:'))
    }
    
    fs.mkdirSync(dp);
    fs.writeFileSync(fp, yaml.stringify(content));

    console.log('Done!');
}

function loadConfig(){
    const configPath = path.join(os.homedir(), '.txrouter', 'default.yaml');
    if(!fs.existsSync(configPath)){
        console.log('No config found, please use "txctl config -i" to create one.');
        process.exit(1);
    }
    const content = fs.readFileSync(configPath).toString();
    const obj = yaml.parse(content);

    const envPath = path.join(os.homedir(), '.txrouter', '.env');
    if(!fs.existsSync(envPath)){
        console.log('No config selected, please use "txctl config -u <config_name> to select one."');
        process.exit(1);
    }
    const env = fs.readFileSync(envPath).toString();

    const conf = obj.environments[env];
    if(!conf){
        console.log(`Config ${env} is not exist, please add the config first.`);
        process.exit(1);
    }

    return {
        protocol: conf.protocol || 'http',
        host: conf.host,
        port: conf.port,
        cluster: conf.cluster,
        username: Base64.decode(conf.username),
        password: Base64.decode(conf.password)
    }
}

function useConfig(env){
    const configPath = path.join(os.homedir(), '.txrouter', 'default.yaml');
    if(!fs.existsSync(configPath)){
        console.log('No config found, please use "txctl config -i" to create one.');
        process.exit(1);
    }
    const content = fs.readFileSync(configPath).toString();
    const obj = yaml.parse(content);
    const conf = obj.environments[env];
    if(!conf){
        console.log(`Config ${env} is not exist, please add the config first.`);
        process.exit(1);
    }
    const envPath = path.join(os.homedir(), '.txrouter', '.env');
    fs.writeFileSync(envPath, trim(env));
    console.log('Done!');
}

module.exports = {
    initConfig: async function () {
        const fp = path.join(os.homedir(), '.txrouter')
        if (fs.existsSync(fp)) {
            const answer = await input.confirm(`---configuration already existed, do you want to replace it (${fp})?:`, {default: false})
            if (answer) {
                createConfig();
            }else {
                console.log('Process terminated.');
                process.exit(1);
            }
        } else {
            createConfig();
        }
    },
    loadConfig: loadConfig,
    useConfig: useConfig
}