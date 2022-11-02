import amqp from 'amqplib'
const exchangeName = process.env.EXCHANGE || 'my-topic'
const routingPattern = process.env.ROUTING_KEY || 'backoffice.users.1.user.created'
const exchangeType =  'topic'
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

    // Crear canal
    const channel = await connection.createChannel()

    // Si no exista el exchange lo crea, si existe no hace nada.
    await channel.assertExchange(exchangeName, exchangeType)

    sleepLoop(messageAmount, async () => { 
        const message = {
            id: Math.random().toString(32).slice(2,6),
            text: 'Mi primer mensaje'
        }
    
        const send = await channel.publish(exchangeName, routingPattern, Buffer.from(JSON.stringify(message)))
        console.log(`Send to "${exchangeName}" exchange. `, message)
    })
}

publishser()

exitAfterSend()