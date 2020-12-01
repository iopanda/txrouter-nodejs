#!/usr/bin/env node

const { Command } = require('commander');
const pjson = require('pjson');
const init = require('./lib/init');

const program = new Command();
program.version(pjson.version);

program
    .command('config').description('config the txctl environment')
    .option('-i, --init', 'init config')
    .option('-f, --file <file_name>', 'config from file')
    .option('-a, --append <file_name>', 'append a config from file')
    .option('-s, --show [config]', 'show config details')
    .option('-r, --remove', 'remove a config')
    .action((cmd) => {
        if(cmd.init){
            init.initConfig();
        }else if(cmd.file){
            console.log('config-by-file');
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
    .command('get')    
    .description('get resource list')
    .command('apps', 'get application list')
    .command('binds', 'get subscription list')
    .action(cmd => {
        
    });

program
    .command('apply')
    .description('apply configuration')
    .option('-f, --filename <filename>', '')
    .action((options) => {
        console.log(options.filename);
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