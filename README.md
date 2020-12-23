# TxRouter-SDK for Node.js

Event based distributed transaction solution with RabbitMQ

## Introduction

TxRouter is a module which allow you pass domain events between multiple services based on RabbitMQ. Before you install this module, please make sure your RabbitMQ has been initialized by *txctl*. 

## Usage as Cli

If you have the admin permission on RabbitMQ, you can use the CLI mode to init the environment. But firstly, you need to init your local configuration to connect RabbitMQ.

### Install
```sh
> npm install -g txrouter
```

You can find the help document by below command:
```sh
> txctl -h       
Usage: txctl [options] [command]

Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  config [options]  config the txctl environment
  init              init txrouter in rabbitmq
  get <kind>        get resource list, applications | subscriptions
  apply [options]   apply configuration
  delete [options]  delete resources
  help [command]    display help for command
```

### Step 1: init configuration to access RabbitMQ
```sh
# init configuration
> txctl config -i
? ---configuration already existed, do you want to replace it (/Users/sunxiaoyu/.txrouter)?: Yes
? environment name: default
? Choose the protocol: http
? host: localhost
? port: 15672
? cluster: rabbit@e2223bb9f86c
? username: guest
? password: *****
Done!
```

### Step 2: use the environment in configuration:
```sh
> txctl config -u default
Done!
```

### Step 3: init RabbitMQ by cli
```sh
> txctl init
TxRouter init done!
```

### Step 4: prepare resource definition files

Now you have already created the basic structure in RabbitMQ. Next you need to prepare the YAML files which defined applications and subscriptions.

The application definition YAML looks like below:
```yaml
apiVersion: 0.0.1
kind: application
name: app01
description: "this is an application"
events:
    - ACTION_CREATE_NEW
    - ACTION_CREATE_SUCCESS
    - ACTION_CREATE_FALSE
```

The subscription definition YAML looks like:

```yaml
apiVersion: 0.0.1
kind: subscription
name: app01
description: "this is a desc"
subscriptions:
  - from: provider_01
    events:
      - ORDER_CREATE_SUCCESS
      - ORDER_CREATE_FAILED
  - from: provider_02
    events:
      - ORDER_CREATE_SUCCESS
```

### Step 5: create resources by cli
```sh
> txctl apply -f app.yaml
Done!
```

### Step 6: list resources by cli
```sh
> txctl get applications
╔══════════════╗
║ Applications ║
╟──────────────╢
║ app01        ║
╟──────────────╢
║ app02        ║
╚══════════════╝

> txctl get subscriptions
-- Subscriptions --
╔══════════╤═════════════╤═══════════════════════╗
║ Source   │ Destination │ EventID               ║
╟──────────┼─────────────┼───────────────────────╢
║ app01    │ app02       │ ORDER_CREATE_FAILED   ║
╟──────────┼─────────────┼───────────────────────╢
║ app01    │ app02       │ ORDER_CREATE_SUCCESS  ║
╚══════════╧═════════════╧═══════════════════════╝
```

## Usage as SDK

### Install

```sh
npm install @ibm_wse/txrouter --save
```

### Configuration

This module is working on RabbitMQ. You need to put your connection information into environment variables. The list of the environment variables list below:

**Mandatory**
- **TXROUTER.APPID**: The application ID provided by TxRouter Services
- **TXROUTER.PROTOCOL**: The protocol of RabbitMQ provided, now we support *amqp* and *amqps*
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

### As a publisher

```javascript
const txrouter = require('@/ibm_wse/txrouter');
txrouter.send(event_id, message);
```

### As a consumer

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