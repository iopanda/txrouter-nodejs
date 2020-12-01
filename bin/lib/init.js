const fs = require('fs');
const os = require('os');
const del = require('del');
const path = require('path');
const yaml = require('yaml');
const input = require('input');
const pjson = require('pjson');
const { Base64 } = require('js-base64');

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
        host: await input.text('host:'),
        port: await input.text('port:'),
        username: Base64.encode(await input.text('username:')),
        password: Base64.encode(await input.password('password:'))
    }
    
    fs.mkdirSync(dp);
    fs.writeFileSync(fp, yaml.stringify(content));

    console.log('Done!');
}

module.exports = {
    initConfig: async function () {
        const fp = path.join(os.homedir(), '.txrouter')
        if (fs.existsSync(fp)) {
            await input.confirm(`---configuration already existed, do you want to replace it (${fp})? [y/N]:`)
            const answer = await input.text(`configuration already existed, do you want to replace it (${fp})? [y/N]:`);
            if (['Y', 'y', 'YES', 'yes'].indexOf(answer) > -1) {
                createConfig();
            } else if (['N', 'n', 'NO', 'no'].indexOf(answer) > -1) {
                console.log('Process terminated.');
                process.exit(1);
            } else {
                console.log('Process terminated.');
                process.exit(1);
            }
        } else {
            createConfig();
        }
    }
}