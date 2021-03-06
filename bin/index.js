#!/usr/bin/env node

const { Command } = require('commander');
const pjson = require('pjson');
const config = require('./lib/config');
const init = require('./lib/init');
const apply = require('./lib/apply');
const get = require('./lib/get');

const program = new Command();
program.version(pjson.version);

program
    .command('config').description('config the txctl environment')
    .option('-i, --init', 'init config')
    .option('-u, --use <config_name>', 'use config')
    .option('-f, --file <file_name>', 'config from file')
    .option('-a, --append <file_name>', 'append a config from file')
    .option('-l, --list', 'list existed config')
    .option('-s, --show [config]', 'show config details')
    .option('-r, --remove', 'remove a config')
    .action((cmd) => {
        if(cmd.init){
            config.initConfig();
        }else if(cmd.file){
            console.log('config-by-file');
        }else if(cmd.use){
            config.useConfig(cmd.use)
        }else if(cmd.append){
            console.log('config-append')
        }else if(cmd.show){
            console.log('config-show')
        }else if(cmd.remove){
            console.log('config-remove');
        }else{
            console.log(`unknow option: '${cmd.args.join(' ')}'. please use "txctl config -h" to find the usage.`);
        }
    });

program
    .command('init').description('init txrouter in rabbitmq').action(cmd => {
        init.initTxRouter().then(res=>{
            console.log('TxRouter init done!');
        }, rej=>{
            console.log(`Error: ${rej}`)
        }).catch(err=>{
            console.log(`Error: ${err}`)
        })
    })

program
    .command('get <kind>')
    .description('get resource list, applications | subscriptions')
    .action((kind,cmd) => {
        get(kind).then(res=>{
            // do nothing
        }, rej=>{
            console.log(rej);
        }).catch(err=>{
            console.log(err);
        })
    });

program
    .command('apply')
    .description('apply configuration')
    .option('-f, --filename <filename>', '')
    .action(cmd => {
        if(cmd.filename){
            apply(cmd.filename).then(res=>{
                console.log("Done!");
            }, rej=>{
                console.log(rej);
            })
        }
    });

program
    .command('delete')
    .description('delete resources')
    .option('app <app_name...>', 'delete application')
    .option('bind <bind_name...>', 'delete binding')
    .action(cmd => {
        console.log(cmd);
    })

program.parse();