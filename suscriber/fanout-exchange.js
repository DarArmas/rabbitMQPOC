'use strict'

const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello'; //in suscriber, queue is important
const exchangeName = process.env.EXCHANGE || 'my-fanout';
const exchangeType = process.env.EXCHANGE_TYPE || 'fanout';



console.log(exchangeName, exchangeName);


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
    await channel.bindQueue(queue, exchangeName);

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