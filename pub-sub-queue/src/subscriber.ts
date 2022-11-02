import amqp from 'amqplib'
const queueName = process.env.QUEUE || 'hello'

function intensiveOperation() {
    let i = 1e9
    while(i--) {}
}

const subscriber = async () => {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)

    channel.consume(queueName, (msg) => {
        const content = JSON.parse(msg!.content.toString())
        intensiveOperation()
        console.log(`Recived: ${content.id} - message: ${content.text}`, content)

        channel.ack(msg!)
    },  
     /* Evitar dar el ACK automatico cuando se consumen los mensajes, puede incurrir en perdida de los mismos.
        { noAck: true } 
     */
    )
}

subscriber()