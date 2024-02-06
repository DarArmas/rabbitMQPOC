'use strict'

const amqp = require('amqplib');
// const queue = process.env.QUEUE || 'hello'; //queue is not needed
const exchangeName = process.env.EXCHANGE || 'my-fanout';
const exchangeType = process.env.EXCHANGE_TYPE || 'fanout';

console.log(exchangeName, exchangeType);

 
const messagesAmount = 6;
const wait = 400;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function sleepLoop(number, cb) {
    while (number --){
        await sleep(wait);
        cb();
    }
}

async function exitAfterSend(){
    await sleep(messagesAmount * wait * 1.2) //1.2 to send the last message
    process.exit(0);
}

async function suscriber () {
    //defaul port 5672
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    //si no existe el exchange, lo crea
    await channel.assertExchange(exchangeName, exchangeType);

    sleepLoop(messagesAmount, async () => {
        const message = {
            id: Math.random().toString(32).slice(2,6),
            text: 'Hola mundillo soy un mensajillo'
        }
        
        const formattedMessage = Buffer.from(JSON.stringify(message))
    
       //cambia a publish
        const sent = await channel.publish(
            exchangeName, 
            '',
            formattedMessage,
            {persistent: true});
    
        sent ? 
        console.log(`Sent to ${exchangeName} exchange`, message) :
        console.log(`Failed sending message to ${exchangeName} exchange`, message) 
    });
}

suscriber()
    .catch(error => {
        console.log(error);
        process.exit(1);
    })

exitAfterSend();
