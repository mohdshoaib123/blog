import amqp from 'amqplib';


let channel:amqp.Channel;

export const connectRabbitMQ=async()=>{
  try{
    const connection=await amqp.connect(
      {protocol:'amqp',
        hostname:process.env.RABBITMQ_HOST,
        port:5672,
        username:process.env.RABBITMQ_USER,
        password:process.env.RABBITMQ_PASSWORD
      }
    )

    connection.on('error', (err) => {
  console.log('Connection error:', err);
});

connection.on('close', () => {
  console.log('Connection close ho gaya');
  retryConnection()
});

    channel=await connection.createChannel();
    console.log("✔ connected to rabbitmq");


channel.on('error', (err) => {
  console.log('Channel error:', err);
});

channel.on('close', () => {
  console.log('Channel close ho gaya');
});

  }




catch(err){
    console.error("❌ failed to connect to Rabbitmq", err);
    retryConnection();

}
  }

  export const publishToQueue=async(queueName:string,message:any)=>{
    if(!channel){
      console.error("❌ RabbitMQ channel is not initialized");
      return;
    }
    await channel.assertQueue(queueName,{durable:true});
    channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message)),{persistent:true});

  }

  export const invalidateCacheJob=async(cacheKeys:string[])=>{
    try{
      const message={
        action:"invalidate_cache",
        keys:cacheKeys
      }
      await publishToQueue("cache_invalidation",message);
      console.log("✔ Cache invalidation job published to RabbitMQ", message);

    }
    catch(err){
      console.error("❌ Failed to publish cache invalidation job to RabbitMQ", err);
    }
  }

  const retryConnection = () => {
  setTimeout(() => {
    console.log("🔄 Reconnecting to RabbitMQ...");
    connectRabbitMQ();
  }, 5000);
};