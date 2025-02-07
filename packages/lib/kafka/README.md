# @lib/kafka

`@lib/kafka`는 모노레포 환경에서 Kafka Producer 기능을 제공하는 NestJS 기반 라이브러리입니다.  
내부적으로 [kafkajs](https://kafka.js.org/)를 사용하여 Kafka 브로커와 연결하고, 메시지를 전송할 수 있도록 도와줍니다.

> **참고:**  
> 이 라이브러리는 모노레포 내에서 공통으로 사용되며, 예를 들어 여러 서비스에서 동일한 Kafka Producer 기능을 공유할 수 있습니다.

## 주요 기능

- **모듈 Import**:
  `forRoot` 메서드를 통해 Kafka 설정을 주입할 수 있습니다.
  ```typescript
  imports : [
     KafkaProducerModule.forRoot(kafkaConfig),
  ]
  ```

- **비동기 설정 지원**:  
  `forRootAsync` 메서드를 통해 애플리케이션의 다른 모듈에서 Kafka 설정을 동적으로 주입할 수 있습니다.
  ```typescript
  imports : [
    ConfigModule.forRoot(),
    KafkaProducerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        clientId: configService.get<string>('KAFKA_CLIENT_ID'),
        brokers: configService.get<string>('KAFKA_BROKERS').split(','),
        options: {
          requestTimeout: configService.get<number>('KAFKA_REQUEST_TIMEOUT'),
          retry: { retries: configService.get<number>('KAFKA_RETRY_COUNT') },
        },
      }),
      inject: [ConfigService],
    }),
  ]
  ```

- **메시지 전송 기능**:  
  `sendMessage(topic: string, message: object)` 메서드를 사용하여 Kafka 토픽으로메시지를 전송할 수 있습니다.

## 설치

모노레포 환경에서는 해당 라이브러리가 이미 포함되어 있으므로,  
Kafka Producer 기능을 사용하는 서비스에서 `@lib/kafka` 패키지를 의존성에 추가하여 사용합니다.

예시 (Yarn Workspaces):
```bash
yarn workspace <service명> add @lib/kafka
```
## 테스트
Docker compose 를 이용해 Kafka 와 SchemaRegistry 를 로컬로 실행 후 통합테스트를 진행합니다.
```bash
yarn workspace @lib/kafka test
```
> **주의**
> 기존에 로컬또는 도커를 이용해 Kafka 를 실행 중 이었다면 기존 Kafka 컨테이너를 종료하거나 src/producer/__test__/producer.service.spec.ts 의 카프카 설정을 변경해주세요.