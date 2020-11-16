# TxRouter-SDK for Node.js

Event based distributed transaction solution with RabbitMQ

### Introduction

TxRouter is a module which allow you pass domain events between multiple services based on RabbitMQ. Before you install this module, please make sure your RabbitMQ has been managed by TxRouter-Services. 

### How to use the module

#### Install

```sh
npm install @ibm_wse/txrouter --save
```

#### Configuration

This module is working on RabbitMQ. You need to put your connection information into environment variables. The list of the environment variables list below:

**Mandatory**
- **TXROUTER.APPID**: The application ID provided by TxRouter Services
- **TXROUTER.PROTOCOL**: The protocal of RabbitMQ provided, now we support *amqp* and *amqps*
- **TXROUTER.HOST**: Host name of RabbitMQ
- **TXROUTER.PORT**: Port for communication with selected protocol
- **TXROUTER.USERNAME**: Username (provided by TxRouter Services)
- **TXROUTER.PASSWORD**: Password (provided by TxRouter Services)

**Optional**

Below environment variables required only for *amqps* protocol (with ssl/tls security)
- **TXROUTER.CERT.CLIENT**: Client certificate
- **TXROUTER.CERT.KEY**: Client key
- **TXROUTER.CERT.PASSPHRASE**: Passparase of client key
- **TXROUTER.CERT.CA**: Server certificate, commonly provided by RabbitMQ provider

#### As a publisher

```javascript
const txrouter = require('@/ibm_wse/txrouter');
txrouter.send(event_id, message);
```

#### As a consumer

```javascript
const txrouter = require('@/ibm_wse/txrouter');
txrouter.listen("target_app_id", {
        "event_id": msg => {
            // handler
        },
        ...
    }
)
```