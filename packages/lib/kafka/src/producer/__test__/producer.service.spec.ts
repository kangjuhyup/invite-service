// kafka-producer.service.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { KafkaProducerService } from '../producer.service';
import { Kafka, Consumer } from 'kafkajs';

describe('KafkaProducerService Integration Test', () => {
  let kafkaProducerService: KafkaProducerService;
  const kafkaBrokers = ['localhost:9092'];
  const testTopic = 'test-topic';
  const kafkaClientId = 'test-client';

  // 테스트 시작 전에 토픽 생성 (Admin API 사용)
  beforeAll(async () => {
    // Kafka Admin 클라이언트를 생성하여 토픽 존재 여부를 확인하고, 없으면 생성
    const kafkaAdmin = new Kafka({
      clientId: 'test-admin-client',
      brokers: kafkaBrokers,
    });
    const admin = kafkaAdmin.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics.includes(testTopic)) {
      await admin.createTopics({
        topics: [
          {
            topic: testTopic,
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
      console.log(`Topic "${testTopic}" created.`);
    } else {
      console.log(`Topic "${testTopic}" already exists.`);
    }
    await admin.disconnect();

    // NestJS 모듈 생성 및 KafkaProducerService 초기화
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        {
          provide: 'KAFKA_CONFIG',
          useValue: {
            clientId: kafkaClientId,
            brokers: kafkaBrokers,
            options: {
              requestTimeout: 30000,
              retry: { retries: 3 },
            },
          },
        },
      ],
    }).compile();

    kafkaProducerService = module.get<KafkaProducerService>(KafkaProducerService);
    await kafkaProducerService.onModuleInit();
  }, 30000);

  // 테스트 종료 후 프로듀서 연결 해제
  afterAll(async () => {
    await kafkaProducerService.onModuleDestroy();
  });

  it('카프카 메세지 프로듀싱 후 컨슈밍', async () => {
    // 테스트용 메시지 생성
    const testMessage = { hello: 'world', timestamp: Date.now() };

    const kafka = new Kafka({
      clientId: 'test-consumer-client',
      brokers: kafkaBrokers,
      logCreator: () => () => {}
    });
    const testConsumer: Consumer = kafka.consumer({
      groupId: `test-consumer-group-${Date.now()}`,
    });
    await testConsumer.connect();
    await testConsumer.subscribe({ topic: testTopic, fromBeginning: false });

    const receivedMessagePromise = new Promise<any>(async (resolve, reject) => {
      try {
        await testConsumer.run({
          eachMessage: async ({ message }) => {
            const value = message.value?.toString();
            if (value) {
              const parsed = JSON.parse(value);
              if (parsed.hello === testMessage.hello) {
                resolve(parsed);
                await testConsumer.stop();
              }
            }
          },
        });
      } catch (error) {
        reject(error);
      }
    });

    // KafkaProducerService를 이용하여 메시지 전송
    await kafkaProducerService.sendMessage(testTopic, testMessage);

    const received = await Promise.race([
      receivedMessagePromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout waiting for message')), 30000)
      ),
    ]);

    expect(received).toEqual(testMessage);

    await testConsumer.disconnect();
  });
});
