require('dotyaml')('env');
const txrouter = require('../index');

require('./app.test')

setTimeout(()=>{
    txrouter.send('DAP2COT', "hello world");
    txrouter.send('DAP2VTS', "hello vts");
}, 10000)

