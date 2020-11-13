const instance = require('../index');

instance.Listener.listen("dap", {
    "DAP2COT": data => {
        console.log("FFFFIFIFIFIFIF"+data.toString());
    }
})

