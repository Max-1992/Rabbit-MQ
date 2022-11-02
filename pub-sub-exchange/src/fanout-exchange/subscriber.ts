import amqp from 'amqplib'
const queueName = process.env.QUEUE || 'hello'
const exchangeName = process.env.EXCHANGE || 'my-fanout'
const exchangeType =  'fanout'

function intensiveOperation() {
    let i = 1e9
    while(i--) {}
}

const subscriber = async (queue: string) => {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    // Creamos la queue si no existe.
    await channel.assertQueue(queue)

    // Si no exista el exchange lo crea, si existe no hace nada.
    await channel.assertExchange(exchangeName, exchangeType)

    // Unimos la queue al exchange
    await channel.bindQueue(queue, exchangeName, '')

    channel.consume(queue, (msg) => {
        const content = JSON.parse(msg!.content.toString())
        intensiveOperation()
        console.log(`Recived in queue ${queue}: ${content.id} - message: ${content.text}`, content)

        channel.ack(msg!)
    },  
     /* Evitar dar el ACK automatico cuando se consumen los mensajes, puede incurrir en perdida de los mismos.
        { noAck: true } 
     */
    )
}

subscriber(queueName)
subscriber('Word')
subscriber('Messi')