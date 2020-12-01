const fs = require('fs');
const yaml = require('yaml');
const os = require('os');
const path = require('path');
const { Base64 } = require('js-base64');

module.exports = function (env) {
    const filename = `${env || 'default'}.yaml`;
    const confFullPath = path.join(os.homedir(), '.txrouter', filename);
    if (!fs.existsSync(confFullPath)) {
        return null;
    }
    const confContent = fs.readFileSync(confFullPath, 'utf8');
    const conf = yaml.parse(confContent);
    return {
        host: conf.host,
        port: conf.port,
        username: Base64.decode(conf.username),
        password: Base64.decode(conf.password)
    }
}