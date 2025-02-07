import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KafkaConfig } from '../interface/config';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor(@Inject('KAFKA_CONFIG') private kafkaConfig: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      requestTimeout: kafkaConfig.options?.requestTimeout || 30000,
      retry: kafkaConfig.options?.retry || { retries: 3 },
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async sendMessage(topic: string, message: object) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
