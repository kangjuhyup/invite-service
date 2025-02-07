import { Module, DynamicModule } from '@nestjs/common';
import { KafkaProducerService } from './producer.service';
import { KafkaConfig } from '../interface/config';

@Module({})
export class KafkaProducerModule {
  static forRootAsync(options: { imports: any[]; useFactory: (...args: any[]) => KafkaConfig; inject: any[] }): DynamicModule {
    return {
      module: KafkaProducerModule,
      imports: options.imports,
      providers: [
        {
          provide: 'KAFKA_CONFIG',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: 'SCHEMA_REGISTRY_CONFIG',
          useFactory: (config: KafkaConfig) => config.schemaRegistry,
          inject: ['KAFKA_CONFIG'],
        },
        KafkaProducerService,
      ],
      exports: [KafkaProducerService],
    };
  }

  static forRoot(config: KafkaConfig): DynamicModule {
    return {
      module: KafkaProducerModule,
      providers: [
        {
          provide: 'KAFKA_CONFIG',
          useValue: config,
        },
        {
          provide: 'SCHEMA_REGISTRY_CONFIG',
          useValue: config.schemaRegistry,
        },
        KafkaProducerService,
      ],
      exports: [KafkaProducerService],
    };
  }
}
