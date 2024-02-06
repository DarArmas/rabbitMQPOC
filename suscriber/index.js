'use strict'

const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello';

function intensiveOperation(){
    let i = 1e9;
    while(i--) {
        
    }
}

async function suscriber () {
    //defaul port 5672
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    //si no existe la cola, la crea
    //durable default true <- puede guardar mensajes persistentes despues de reiniciar
    await channel.assertQueue(queue);

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