const wait = require('wait')
require('dotenv').config()
require('module-alias/register')
const path = require('path')
const Friday = require(`./structures/Bitzxier.js`)
const client = new Friday()
const config = require(`${process.cwd()}/config.json`);

(async () => {
    await client.initializedata()
    await client.initializeMongoose()
    await wait(2000);
    await client.loadEvents()
    await client.loadlogs()
    await client.SQL()
    await client.loadMain()
    await client.login(config.TOKEN)
})()
