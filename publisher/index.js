'use strict'

const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello';

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

    //si no existe la cola, la crea
    //durable default true <- puede guardar mensajes persistentes despues de reiniciar
    await channel.assertQueue(queue);

    sleepLoop(messagesAmount, async () => {
        const message = {
            id: Math.random().toString(32).slice(2,6),
            text: 'Hola mundillo soy un mensajillo'
        }
        
        const formattedMessage = Buffer.from(JSON.stringify(message))
    
        //persistent: se va a guardar el canael en el rabbit (solo cuando el canal es durable)
        const sent = await channel.sendToQueue(
            queue, 
            formattedMessage,
            {persistent: true});
    
        sent ? 
        console.log(`Sent to ${queue}`, message) :
        console.log(`Failed sending message to ${queue}`, message) 
    });
}

suscriber()
    .catch(error => {
        console.log(error);
        process.exit(1);
    })

exitAfterSend();
