import amqp from 'amqplib'
const queueName = process.env.QUEUE || 'hello'
const messageAmount = 6
const wait = 400

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    }) 
}


async function sleepLoop(number: number, cb: any) {
    while(number--) {
        await sleep(wait)
        cb()
    }
}

async function exitAfterSend() {
    const ms = messageAmount * wait * 1.2
    await sleep(ms)
    process.exit(0)
}

const publishser = async () => {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)

    sleepLoop(messageAmount, async () => { 
        const message = {
            id: Math.random().toString(32).slice(2,6),
            text: 'Mi primer mensaje'
        }
    
        const send = await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
        console.log(`Send to "${queueName}" queue. `, message)
    })
}

publishser()

exitAfterSend()