'use strict'

const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello'; //in suscriber, queue is important
const exchangeName = process.env.EXCHANGE || 'my-topic';
const exchangeType = process.env.EXCHANGE_TYPE || 'topic';
const pattern = process.env.PATTERN || ''; //hace referencia a la routing key




console.log(exchangeType, exchangeName, pattern);


function intensiveOperation(){
    let i = 1e9;
    while(i--) {
        
    }
}

async function suscriber () {
    //defaul port 5672
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);
   //si no existe el exchange, lo crea
   await channel.assertExchange(exchangeName, exchangeType);


    //ligar esta queue con el exchange
    await channel.bindQueue(queue, exchangeName, pattern);

    channel.consume(queue, message => {
        const content = JSON.parse(message.content.toString());
        console.log(`Received message from ${queue} queue`);
        console.log(content);
        channel.ack(message); //marcar como el mensaje recibido y eliminar de la cola
    });
}

suscriber()
    .catch(error => {
        console.log(error);
        process.exit(1);
    })