import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KafkaConfig } from '../interface/config';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private schemaRegistry: SchemaRegistry;
  
  constructor(
    @Inject('KAFKA_CONFIG') private kafkaConfig: KafkaConfig,
    @Inject('SCHEMA_REGISTRY_CONFIG') private schemaRegistryConfig: KafkaConfig['schemaRegistry']
  ) {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      requestTimeout: kafkaConfig.options?.requestTimeout || 30000,
      retry: kafkaConfig.options?.retry || { retries: 3 },
    });

    this.producer = this.kafka.producer();

    // 스키마 레지스트리 사용할 경우에만
    if (schemaRegistryConfig.url) this.schemaRegistry = new SchemaRegistry({ host: this.schemaRegistryConfig.url });
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async sendMessage(topic: string, message: object, serialize:boolean = false) {
    //TODO : schemaRegistry 에서 토픽 가져와서 직렬화
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    }).catch(err => {
      throw err;
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
