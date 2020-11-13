# TxRouter-SDK for Node.js

## Event based distributed transaction solution with RabbitMQ

1. Introduction

TxRouter is a module which allow you pass domain events between multiple services based on RabbitMQ. Before you install this module, please make sure your RabbitMQ has been managed by TxRouter-Services. 

2. How to use the module

Install

`
npm install @iopanda/txrouter --save
`

As a publisher

`
const txrouter = require('txrouter');

txrouter.send(event_id, message);
`

As a consumer

`
const txrouter = require('txrouter');
txrouter.listen(target_app_id, {
        "event_id": function(msg){
            // handler
        },
        ...
    }
)
`